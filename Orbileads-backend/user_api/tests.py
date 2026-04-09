from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

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
