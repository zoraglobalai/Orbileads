from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

User = get_user_model()


class UserAuthAPITests(APITestCase):
    def setUp(self):
        self.password = 'StrongPassword123!'
        self.user = User.objects.create_user(
            email='existing@example.com',
            password=self.password,
            full_name='Existing User',
            mobile_number='+919999999999',
            country='India',
            company_name='Orbileads',
            accepted_terms=True,
        )

    def test_signup_success(self):
        payload = {
            'full_name': 'Test User',
            'email': 'testuser@example.com',
            'mobile_number': '+918888888888',
            'password': 'AnotherStrong123!',
            'confirm_password': 'AnotherStrong123!',
            'country': 'India',
            'company_name': 'Orbileads',
            'accept_terms': True,
        }

        response = self.client.post(reverse('user-signup'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertTrue(User.objects.filter(email='testuser@example.com').exists())

    def test_login_success_returns_tokens(self):
        response = self.client.post(
            reverse('user-login'),
            {'email': self.user.email, 'password': self.password},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data['data']['tokens'])
        self.assertIn('refresh', response.data['data']['tokens'])

    def test_failed_login_increments_attempts(self):
        response = self.client.post(
            reverse('user-login'),
            {'email': self.user.email, 'password': 'WrongPassword123!'},
            format='json',
        )

        self.user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.user.failed_login_attempts, 1)

    def test_get_current_user_profile(self):
        token = RefreshToken.for_user(self.user)
        token['token_version'] = self.user.token_version
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(token.access_token)}')

        response = self.client.get(reverse('current-user-profile'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['email'], self.user.email)

    def test_change_password_rotates_token_version(self):
        token = RefreshToken.for_user(self.user)
        token['token_version'] = self.user.token_version
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(token.access_token)}')

        response = self.client.post(
            reverse('user-change-password'),
            {
                'current_password': self.password,
                'new_password': 'NewSecurePassword123!',
                'confirm_new_password': 'NewSecurePassword123!',
            },
            format='json',
        )

        self.user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.token_version, 1)

    def test_logout_blacklists_current_users_refresh_token(self):
        refresh = RefreshToken.for_user(self.user)
        refresh['token_version'] = self.user.token_version
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

        response = self.client.post(
            reverse('user-logout'),
            {'refresh_token': str(refresh)},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            BlacklistedToken.objects.filter(token__jti=refresh['jti']).exists()
        )

    def test_logout_rejects_refresh_token_from_different_user(self):
        other_user = User.objects.create_user(
            email='other@example.com',
            password='AnotherPassword123!',
            full_name='Other User',
            mobile_number='+917777777777',
            country='India',
            company_name='Orbileads',
            accepted_terms=True,
        )
        access_refresh = RefreshToken.for_user(self.user)
        access_refresh['token_version'] = self.user.token_version
        other_refresh = RefreshToken.for_user(other_user)
        other_refresh['token_version'] = other_user.token_version
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(access_refresh.access_token)}')

        response = self.client.post(
            reverse('user-logout'),
            {'refresh_token': str(other_refresh)},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(
            BlacklistedToken.objects.filter(token__jti=other_refresh['jti']).exists()
        )

    def test_forgot_password_sends_reset_email(self):
        response = self.client.post(
            reverse('user-forgot-password'),
            {'email': self.user.email},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('/reset-password/', mail.outbox[0].body)

    def test_reset_password_with_uid_and_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)

        response = self.client.post(
            reverse('user-reset-password'),
            {
                'uid': uid,
                'token': token,
                'new_password': 'UpdatedPassword123!',
                'confirm_new_password': 'UpdatedPassword123!',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('UpdatedPassword123!'))

    @patch('user_api.services.verify_google_id_token')
    def test_google_auth_creates_user_and_returns_tokens(self, mock_verify_google_id_token):
        mock_verify_google_id_token.return_value = {
            'email': 'googleuser@example.com',
            'email_verified': True,
            'name': 'Google User',
            'iss': 'https://accounts.google.com',
        }

        response = self.client.post(
            reverse('user-google-auth'),
            {'credential': 'fake-google-token'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(email='googleuser@example.com').exists())
        self.assertIn('access', response.data['data']['tokens'])
