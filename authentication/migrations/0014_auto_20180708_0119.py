# Generated by Django 2.0.1 on 2018-07-07 23:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0013_auto_20180706_1655'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='versionlabel',
            field=models.CharField(blank=True, default='0.01', max_length=40),
        ),
    ]