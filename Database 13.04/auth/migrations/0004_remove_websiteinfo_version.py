# Generated by Django 2.0.1 on 2018-03-23 06:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_filtersettings'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='websiteinfo',
            name='version',
        ),
    ]