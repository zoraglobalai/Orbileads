from django.urls import path

from .views import (
    ChangePasswordView,
    CheckEmailView,
    CurrentUserProfileView,
    ForgotPasswordView,
    GoogleAuthView,
    LoginView,
    LogoutView,
    ResetPasswordView,
    SignupView,
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='user-signup'),
    path('check-email/', CheckEmailView.as_view(), name='user-check-email'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('google-auth/', GoogleAuthView.as_view(), name='user-google-auth'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='user-forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='user-reset-password'),
    path('me/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='user-change-password'),
    path('logout/', LogoutView.as_view(), name='user-logout'),
]
