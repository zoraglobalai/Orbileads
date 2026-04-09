import django.utils.timezone
import uuid

from django.db import migrations, models

import user_api.managers


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('full_name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('mobile_number', models.CharField(max_length=20, unique=True)),
                ('country', models.CharField(max_length=100)),
                ('company_name', models.CharField(blank=True, max_length=150)),
                ('accepted_terms', models.BooleanField(default=False)),
                ('accepted_terms_at', models.DateTimeField(blank=True, null=True)),
                ('failed_login_attempts', models.PositiveIntegerField(default=0)),
                ('last_failed_login_at', models.DateTimeField(blank=True, null=True)),
                ('account_locked_until', models.DateTimeField(blank=True, null=True)),
                ('token_version', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'groups',
                    models.ManyToManyField(
                        blank=True,
                        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
                        related_name='user_set',
                        related_query_name='user',
                        to='auth.group',
                        verbose_name='groups',
                    ),
                ),
                (
                    'user_permissions',
                    models.ManyToManyField(
                        blank=True,
                        help_text='Specific permissions for this user.',
                        related_name='user_set',
                        related_query_name='user',
                        to='auth.permission',
                        verbose_name='user permissions',
                    ),
                ),
            ],
            options={
                'db_table': 'users',
                'ordering': ['-date_joined'],
            },
            managers=[
                ('objects', user_api.managers.UserManager()),
            ],
        ),
    ]
