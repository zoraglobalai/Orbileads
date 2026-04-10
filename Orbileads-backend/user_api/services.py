import logging
import smtplib
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models import F
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.exceptions import APIException, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger(__name__)
User = get_user_model()


def get_lockout_config():
    config = getattr(settings, 'USER_AUTH_SECURITY', {})
    return (
        config.get('MAX_FAILED_LOGIN_ATTEMPTS', 5),
        config.get('ACCOUNT_LOCK_MINUTES', 15),
    )


def is_account_locked(user):
    return bool(user.account_locked_until and user.account_locked_until > timezone.now())


def register_failed_login(user):
    max_attempts, lock_minutes = get_lockout_config()
    now = timezone.now()

    user.failed_login_attempts = F('failed_login_attempts') + 1
    user.last_failed_login_at = now
    user.save(update_fields=['failed_login_attempts', 'last_failed_login_at'])
    user.refresh_from_db(fields=['failed_login_attempts', 'account_locked_until'])

    if user.failed_login_attempts >= max_attempts:
        user.account_locked_until = now + timedelta(minutes=lock_minutes)
        user.save(update_fields=['account_locked_until'])


def reset_failed_login_state(user):
    updates = []
    if user.failed_login_attempts:
        user.failed_login_attempts = 0
        updates.append('failed_login_attempts')
    if user.account_locked_until is not None:
        user.account_locked_until = None
        updates.append('account_locked_until')
    if user.last_failed_login_at is not None:
        user.last_failed_login_at = None
        updates.append('last_failed_login_at')
    if updates:
        user.save(update_fields=updates)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['token_version'] = user.token_version
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def authenticate_user(email, password):
    normalized_email = User.objects.normalize_email(email).lower().strip()
    try:
        user = User.objects.get(email=normalized_email)
    except User.DoesNotExist as exc:
        raise AuthenticationFailed('Invalid email or password.') from exc

    if is_account_locked(user):
        raise AuthenticationFailed('Account is temporarily locked. Please try again later.')

    if not user.is_active:
        raise AuthenticationFailed('User account is inactive.')

    if not user.check_password(password):
        register_failed_login(user)
        if is_account_locked(user):
            raise AuthenticationFailed('Account is temporarily locked. Please try again later.')
        raise AuthenticationFailed('Invalid email or password.')

    reset_failed_login_state(user)
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    return user


def invalidate_user_tokens(user):
    user.token_version += 1


def log_password_reset_request(email):
    normalized_email = User.objects.normalize_email(email).lower().strip()
    user = User.objects.filter(email=normalized_email).first()

    if user is None:
        logger.info('Password reset requested for unknown email=%s', normalized_email)
        return

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_url = f"{settings.FRONTEND_BASE_URL}/reset-password/{uid}/{token}"

    subject = 'Reset your Orbileads password'
    message = (
        f"Hi {user.full_name or 'there'},\n\n"
        f"We received a request to reset your Orbileads password.\n"
        f"Use the link below to choose a new password:\n\n{reset_url}\n\n"
        "If you did not request this, you can safely ignore this email."
    )

    if settings.EMAIL_BACKEND.endswith('smtp.EmailBackend'):
        if settings.EMAIL_HOST_USER in {'', 'yourgmail@gmail.com'} or settings.EMAIL_HOST_PASSWORD in {
            '',
            'your_app_password',
        }:
            raise APIException(
                'Password reset email is not configured. Update SMTP credentials in the backend .env file.'
            )

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except smtplib.SMTPAuthenticationError as exc:
        logger.exception('SMTP authentication failed while sending reset email')
        raise APIException(
            'Password reset email could not be sent. Check your Gmail address and App Password in backend .env.'
        ) from exc
    except Exception as exc:
        logger.exception('Unexpected email delivery failure')
        raise APIException('Password reset email could not be sent right now. Please try again later.') from exc

    logger.info('Password reset email sent to email=%s', normalized_email)


def get_user_from_reset_credentials(uid, token):
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as exc:
        raise AuthenticationFailed('Invalid or expired password reset link.') from exc

    if not default_token_generator.check_token(user, token):
        raise AuthenticationFailed('Invalid or expired password reset link.')

    return user


def verify_google_id_token(token):
    client_id = getattr(settings, 'GOOGLE_CLIENT_ID', '')
    if not client_id:
        raise AuthenticationFailed('Google sign-in is not configured.')

    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token
    except ImportError as exc:
        raise AuthenticationFailed('Google sign-in dependencies are not installed.') from exc

    try:
        payload = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
    except ValueError as exc:
        raise AuthenticationFailed('Invalid Google credential.') from exc

    if payload.get('iss') not in {'accounts.google.com', 'https://accounts.google.com'}:
        raise AuthenticationFailed('Invalid Google issuer.')

    if not payload.get('email_verified'):
        raise AuthenticationFailed('Google email is not verified.')

    return payload


def authenticate_google_user(credential):
    payload = verify_google_id_token(credential)
    email = User.objects.normalize_email(payload['email']).lower().strip()
    user = User.objects.filter(email=email).first()

    if user is None:
        full_name = (payload.get('name') or email.split('@')[0]).strip()
        user = User(
            email=email,
            full_name=full_name,
            mobile_number='',
            country='',
            company_name='',
            accepted_terms=True,
            accepted_terms_at=timezone.now(),
            is_active=True,
        )
        user.set_unusable_password()
        user.save()

    if not user.is_active:
        raise AuthenticationFailed('User account is inactive.')

    reset_failed_login_state(user)
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    return user
