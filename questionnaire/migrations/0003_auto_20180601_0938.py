# Generated by Django 2.0.1 on 2018-06-01 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaire', '0002_auto_20180601_0929'),
    ]

    operations = [
        migrations.AlterField(
            model_name='presurvey',
            name='site0',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='presurvey',
            name='site1',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='presurvey',
            name='site2',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='presurvey',
            name='site3',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='presurvey',
            name='site4',
            field=models.TextField(default='', null=True),
        ),
    ]