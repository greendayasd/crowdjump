# Generated by Django 2.0.1 on 2018-03-12 01:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0005_auto_20180311_2310'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='implemented',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='comment',
            name='manageable',
            field=models.BooleanField(default=True),
        ),
    ]