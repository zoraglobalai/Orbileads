from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('user_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='mobile_number',
            field=models.CharField(max_length=20),
        ),
    ]
