from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class SignupRateThrottle(AnonRateThrottle):
    scope = 'signup'


class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'


class ForgotPasswordRateThrottle(AnonRateThrottle):
    scope = 'forgot_password'


class ResetPasswordRateThrottle(AnonRateThrottle):
    scope = 'reset_password'


class ChangePasswordRateThrottle(UserRateThrottle):
    scope = 'change_password'


class ProfileUpdateRateThrottle(UserRateThrottle):
    scope = 'profile_update'


class LogoutRateThrottle(UserRateThrottle):
    scope = 'logout'
