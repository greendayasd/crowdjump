# Generated by Django 2.0.1 on 2018-04-27 05:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0006_auto_20180426_1859'),
    ]

    operations = [
        migrations.AddField(
            model_name='idea',
            name='newest_comment',
            field=models.IntegerField(default=-1),
        ),
    ]
