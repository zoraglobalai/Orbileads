from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import UserChangeForm, UserCreationForm
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    ordering = ['-date_joined']
    list_display = (
        'email',
        'full_name',
        'mobile_number',
        'country',
        'accepted_terms',
        'failed_login_attempts',
        'account_locked_until',
        'is_active',
        'is_staff',
        'date_joined',
    )
    search_fields = ('email', 'full_name', 'mobile_number', 'company_name')
    readonly_fields = ('date_joined', 'updated_at', 'last_login', 'accepted_terms_at')
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'email',
                    'password',
                    'full_name',
                    'mobile_number',
                    'country',
                    'company_name',
                )
            },
        ),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (
            'Security',
            {
                'fields': (
                    'accepted_terms',
                    'accepted_terms_at',
                    'failed_login_attempts',
                    'last_failed_login_at',
                    'account_locked_until',
                    'token_version',
                    'last_login',
                )
            },
        ),
        ('Important dates', {'fields': ('date_joined', 'updated_at')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'full_name',
                    'mobile_number',
                    'country',
                    'company_name',
                    'password1',
                    'password2',
                    'is_staff',
                    'is_superuser',
                    'is_active',
                ),
            },
        ),
    )
