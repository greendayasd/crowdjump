# Generated by Django 2.0.1 on 2018-04-11 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_auto_20180404_2217'),
    ]

    operations = [
        migrations.AddField(
            model_name='gameinfo',
            name='jumps',
            field=models.IntegerField(default=0),
        ),
    ]
