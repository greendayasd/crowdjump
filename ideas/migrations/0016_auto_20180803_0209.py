# Generated by Django 2.0.1 on 2018-08-03 00:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0015_idea_currently_implemented'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='rater1',
            field=models.CharField(default='', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='comment',
            name='rater2',
            field=models.CharField(default='', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='comment',
            name='raterfinal',
            field=models.CharField(default='', max_length=50, null=True),
        ),
    ]