from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class UserJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        token_version = validated_token.get('token_version')
        if token_version is None or token_version != user.token_version:
            raise AuthenticationFailed('Token is no longer valid.', code='token_not_valid')
        if not user.is_active:
            raise AuthenticationFailed('User account is inactive.', code='user_inactive')
        return user
