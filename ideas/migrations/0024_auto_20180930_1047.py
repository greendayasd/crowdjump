# Generated by Django 2.0.1 on 2018-09-30 08:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0023_auto_20180927_1316'),
    ]

    operations = [
        migrations.AlterField(
            model_name='idea',
            name='version',
            field=models.ForeignKey(default=30, on_delete=django.db.models.deletion.DO_NOTHING, related_name='ideas', to='website.Version'),
        ),
    ]
