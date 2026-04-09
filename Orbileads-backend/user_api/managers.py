from django.contrib.auth.base_user import BaseUserManager
from django.utils import timezone

from .validators import normalize_company_name, normalize_country, normalize_full_name, normalize_mobile_number


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email address must be provided.')
        if not password:
            raise ValueError('The password must be provided.')

        email = self.normalize_email(email).lower().strip()
        extra_fields['full_name'] = normalize_full_name(extra_fields.get('full_name', ''))
        extra_fields['mobile_number'] = normalize_mobile_number(extra_fields.get('mobile_number', ''))
        extra_fields['country'] = normalize_country(extra_fields.get('country', ''))
        extra_fields['company_name'] = normalize_company_name(extra_fields.get('company_name', ''))

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        if user.accepted_terms and not user.accepted_terms_at:
            user.accepted_terms_at = timezone.now()
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_active', True)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('accepted_terms', True)
        extra_fields.setdefault('accepted_terms_at', timezone.now())

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)
