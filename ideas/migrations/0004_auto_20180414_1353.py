# Generated by Django 2.0.1 on 2018-04-14 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0003_auto_20180413_0309'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='comment',
            name='downvotes',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='status',
            field=models.IntegerField(default=-1, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='upvotes',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
