# Generated by Django 2.0.1 on 2018-07-06 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0012_account_versionlabel'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='versionlabel',
            field=models.CharField(blank=True, default='0,01', max_length=40),
        ),
    ]
