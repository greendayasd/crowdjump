# Generated by Django 2.0.1 on 2018-03-11 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='idea',
            name='request_text',
            field=models.CharField(max_length=50),
        ),
    ]
