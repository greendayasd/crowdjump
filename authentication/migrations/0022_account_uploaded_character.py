# Generated by Django 2.0.1 on 2018-09-18 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0021_auto_20180918_1251'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='uploaded_character',
            field=models.FileField(null=True, upload_to='characters/'),
        ),
    ]
