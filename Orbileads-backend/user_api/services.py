import logging
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import F
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
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
    logger.info('Password reset requested for email=%s', email)
