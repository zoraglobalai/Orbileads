from rest_framework import permissions, status
from rest_framework.views import APIView

from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    GoogleAuthSerializer,
    LoginSerializer,
    LogoutSerializer,
    ResetPasswordSerializer,
    SignupSerializer,
    UpdateProfileSerializer,
    UserProfileSerializer,
)
from .throttles import (
    ChangePasswordRateThrottle,
    ForgotPasswordRateThrottle,
    LoginRateThrottle,
    LogoutRateThrottle,
    ProfileUpdateRateThrottle,
    ResetPasswordRateThrottle,
    SignupRateThrottle,
)
from .utils import build_response


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [SignupRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return build_response(
            success=True,
            message='User registered successfully.',
            data=UserProfileSerializer(user).data,
            status_code=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        return build_response(
            success=True,
            message='Login successful.',
            data={
                'user': UserProfileSerializer(user).data,
                'tokens': serializer.validated_data['tokens'],
            },
        )


class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        return build_response(
            success=True,
            message='Google authentication successful.',
            data={
                'user': UserProfileSerializer(user).data,
                'tokens': serializer.validated_data['tokens'],
            },
        )


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ForgotPasswordRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return build_response(
            success=True,
            message='If an account with that email exists, the password reset request has been accepted.',
        )


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ResetPasswordRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return build_response(
            success=True,
            message='If the account exists, the password has been reset successfully.',
        )


class CurrentUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ProfileUpdateRateThrottle]

    def get(self, request, *args, **kwargs):
        return build_response(
            success=True,
            message='Current user profile fetched successfully.',
            data=UserProfileSerializer(request.user).data,
        )

    def put(self, request, *args, **kwargs):
        serializer = UpdateProfileSerializer(instance=request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return build_response(
            success=True,
            message='Profile updated successfully.',
            data=UserProfileSerializer(user).data,
        )

    def patch(self, request, *args, **kwargs):
        serializer = UpdateProfileSerializer(instance=request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return build_response(
            success=True,
            message='Profile updated successfully.',
            data=UserProfileSerializer(user).data,
        )


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ChangePasswordRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return build_response(
            success=True,
            message='Password changed successfully. Please log in again.',
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [LogoutRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return build_response(
            success=True,
            message='Logout successful.',
        )
