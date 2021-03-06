# Generated by Django 2.0.1 on 2018-09-19 12:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0027_auto_20180918_1629'),
    ]

    operations = [
        migrations.AddField(
            model_name='gameinfo',
            name='overall_coins',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gameinfo',
            name='overall_eastereggs',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gameinfo',
            name='overall_powerups',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gameinfo',
            name='powerups',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='gameinfo',
            name='version',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.DO_NOTHING, related_name='gameinfo', to='website.Version'),
        ),
        migrations.AlterField(
            model_name='websiteinfo',
            name='version',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.DO_NOTHING, related_name='websiteinfo', to='website.Version'),
        ),
    ]
