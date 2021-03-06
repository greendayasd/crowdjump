# Generated by Django 2.0.1 on 2018-09-18 10:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0020_auto_20180917_1853'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='character',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='gameinfo',
            name='version',
            field=models.ForeignKey(default=6, on_delete=django.db.models.deletion.DO_NOTHING, related_name='gameinfo', to='website.Version'),
        ),
        migrations.AlterField(
            model_name='websiteinfo',
            name='version',
            field=models.ForeignKey(default=6, on_delete=django.db.models.deletion.DO_NOTHING, related_name='websiteinfo', to='website.Version'),
        ),
    ]
