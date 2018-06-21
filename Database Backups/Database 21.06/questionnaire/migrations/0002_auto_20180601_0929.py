# Generated by Django 2.0.1 on 2018-06-01 07:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('questionnaire', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='presurvey',
            name='username',
        ),
        migrations.AddField(
            model_name='presurvey',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='questionnaire', to=settings.AUTH_USER_MODEL),
        ),
    ]
