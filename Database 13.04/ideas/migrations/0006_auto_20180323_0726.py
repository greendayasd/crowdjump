# Generated by Django 2.0.1 on 2018-03-23 06:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ideas', '0005_auto_20180323_0714'),
    ]

    operations = [
        migrations.AlterField(
            model_name='idea',
            name='version',
            field=models.ForeignKey(default=3, on_delete=django.db.models.deletion.DO_NOTHING, related_name='ideas', to='website.Version'),
        ),
    ]