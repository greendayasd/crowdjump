# Generated by Django 2.0.1 on 2018-09-18 10:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0020_auto_20180917_1853'),
    ]

    operations = [
        migrations.AlterField(
            model_name='idea',
            name='version',
            field=models.ForeignKey(default=6, on_delete=django.db.models.deletion.DO_NOTHING, related_name='ideas', to='website.Version'),
        ),
    ]