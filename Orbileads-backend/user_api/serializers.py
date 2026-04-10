from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .services import (
    authenticate_google_user,
    authenticate_user,
    get_user_from_reset_credentials,
    get_tokens_for_user,
    invalidate_user_tokens,
    log_password_reset_request,
)
from .validators import (
    normalize_company_name,
    normalize_country,
    normalize_full_name,
    validate_company_name,
    validate_country,
    validate_full_name,
    validate_mobile_number,
)

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'mobile_number',
            'country',
            'company_name',
            'accepted_terms',
            'accepted_terms_at',
            'date_joined',
            'updated_at',
        ]
        read_only_fields = ['id', 'email', 'accepted_terms', 'accepted_terms_at', 'date_joined', 'updated_at']


class SignupSerializer(serializers.ModelSerializer):
    mobile_number = serializers.CharField(required=False, allow_blank=True, default='')
    password = serializers.CharField(write_only=True, trim_whitespace=False, style={'input_type': 'password'})
    confirm_password = serializers.CharField(
        write_only=True, trim_whitespace=False, style={'input_type': 'password'}
    )
    accept_terms = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = [
            'full_name',
            'email',
            'mobile_number',
            'password',
            'confirm_password',
            'country',
            'company_name',
            'accept_terms',
        ]

    def validate_full_name(self, value):
        return validate_full_name(value)

    def validate_email(self, value):
        normalized = User.objects.normalize_email(value).lower().strip()
        if User.objects.filter(email=normalized).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized

    def validate_mobile_number(self, value):
        if not value.strip():
            return ''
        return validate_mobile_number(value)

    def validate_country(self, value):
        return validate_country(value)

    def validate_company_name(self, value):
        return validate_company_name(value)

    def validate_accept_terms(self, value):
        if value is not True:
            raise serializers.ValidationError('You must accept the terms and conditions.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        try:
            temp_user = User(
                email=attrs['email'],
                full_name=attrs['full_name'],
                mobile_number=attrs['mobile_number'],
                country=attrs['country'],
                company_name=attrs.get('company_name', ''),
            )
            password_validation.validate_password(attrs['password'], temp_user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)}) from exc

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        accept_terms = validated_data.pop('accept_terms')
        password = validated_data.pop('password')

        return User.objects.create_user(
            password=password,
            accepted_terms=accept_terms,
            accepted_terms_at=timezone.now(),
            **validated_data,
        )


class EmailAvailabilitySerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        normalized = User.objects.normalize_email(value).lower().strip()
        if User.objects.filter(email=normalized).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False, style={'input_type': 'password'})

    def validate_email(self, value):
        return User.objects.normalize_email(value).lower().strip()

    def validate(self, attrs):
        user = authenticate_user(attrs['email'], attrs['password'])
        attrs['user'] = user
        attrs['tokens'] = get_tokens_for_user(user)
        return attrs


class GoogleAuthSerializer(serializers.Serializer):
    credential = serializers.CharField(write_only=True, trim_whitespace=True)

    def validate_credential(self, value):
        token = value.strip()
        if not token:
            raise serializers.ValidationError('Google credential is required.')
        return token

    def validate(self, attrs):
        user = authenticate_google_user(attrs['credential'])
        attrs['user'] = user
        attrs['tokens'] = get_tokens_for_user(user)
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return User.objects.normalize_email(value).lower().strip()

    def save(self, **kwargs):
        email = self.validated_data['email']
        log_password_reset_request(email)
        return {'email': email}


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, trim_whitespace=False, style={'input_type': 'password'})
    confirm_new_password = serializers.CharField(
        write_only=True, trim_whitespace=False, style={'input_type': 'password'}
    )

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({'confirm_new_password': 'Passwords do not match.'})

        user = get_user_from_reset_credentials(attrs['uid'], attrs['token'])
        try:
            password_validation.validate_password(attrs['new_password'], user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'new_password': list(exc.messages)}) from exc
        attrs['user'] = user
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.failed_login_attempts = 0
        user.last_failed_login_at = None
        user.account_locked_until = None
        user.token_version += 1
        user.save(
            update_fields=[
                'password',
                'failed_login_attempts',
                'last_failed_login_at',
                'account_locked_until',
                'token_version',
                'updated_at',
            ]
        )
        return {'email': user.email}


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'mobile_number', 'country', 'company_name']

    def validate_full_name(self, value):
        return validate_full_name(value)

    def validate_mobile_number(self, value):
        return validate_mobile_number(value)

    def validate_country(self, value):
        return validate_country(value)

    def validate_company_name(self, value):
        return validate_company_name(value)

    def update(self, instance, validated_data):
        instance.full_name = normalize_full_name(validated_data.get('full_name', instance.full_name))
        instance.mobile_number = validated_data.get('mobile_number', instance.mobile_number)
        instance.country = normalize_country(validated_data.get('country', instance.country))
        instance.company_name = normalize_company_name(validated_data.get('company_name', instance.company_name))
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        style={'input_type': 'password'},
        required=False,
        allow_blank=True,
    )
    new_password = serializers.CharField(write_only=True, trim_whitespace=False, style={'input_type': 'password'})
    confirm_new_password = serializers.CharField(
        write_only=True, trim_whitespace=False, style={'input_type': 'password'}
    )

    def validate(self, attrs):
        user = self.context['request'].user
        current_password = attrs.get('current_password', '')

        if current_password and not user.check_password(current_password):
            raise serializers.ValidationError({'current_password': 'Current password is incorrect.'})
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({'confirm_new_password': 'Passwords do not match.'})

        try:
            password_validation.validate_password(attrs['new_password'], user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'new_password': list(exc.messages)}) from exc

        if current_password and current_password == attrs['new_password']:
            raise serializers.ValidationError(
                {'new_password': 'New password must be different from the current password.'}
            )
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.failed_login_attempts = 0
        user.last_failed_login_at = None
        user.account_locked_until = None
        invalidate_user_tokens(user)
        user.save(
            update_fields=[
                'password',
                'failed_login_attempts',
                'last_failed_login_at',
                'account_locked_until',
                'token_version',
                'updated_at',
            ]
        )
        return user


class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate_refresh_token(self, value):
        if not value.strip():
            raise serializers.ValidationError('Refresh token is required.')
        return value.strip()

    def validate(self, attrs):
        request = self.context['request']

        try:
            token = RefreshToken(attrs['refresh_token'])
        except TokenError as exc:
            raise serializers.ValidationError({'refresh_token': 'Invalid or expired refresh token.'}) from exc

        token_user_id = str(token.get('user_id', ''))
        request_user_id = str(request.user.pk)
        token_version = token.get('token_version')

        if token_user_id != request_user_id:
            raise serializers.ValidationError({'refresh_token': 'Refresh token does not belong to the current user.'})

        if token_version != request.user.token_version:
            raise serializers.ValidationError({'refresh_token': 'Refresh token is no longer valid.'})

        attrs['token'] = token
        return attrs

    def save(self, **kwargs):
        self.validated_data['token'].blacklist()
        return {}
