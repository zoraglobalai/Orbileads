from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from .models import User
from .validators import validate_company_name, validate_country, validate_full_name, validate_mobile_number


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'mobile_number', 'country', 'company_name')

    def clean_full_name(self):
        return validate_full_name(self.cleaned_data['full_name'])

    def clean_mobile_number(self):
        return validate_mobile_number(self.cleaned_data['mobile_number'])

    def clean_country(self):
        return validate_country(self.cleaned_data['country'])

    def clean_company_name(self):
        return validate_company_name(self.cleaned_data.get('company_name', ''))

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError('Passwords do not match.')
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'full_name',
            'mobile_number',
            'country',
            'company_name',
            'accepted_terms',
            'accepted_terms_at',
            'failed_login_attempts',
            'last_failed_login_at',
            'account_locked_until',
            'token_version',
            'is_active',
            'is_staff',
            'is_superuser',
        )

    def clean_password(self):
        return self.initial['password']
