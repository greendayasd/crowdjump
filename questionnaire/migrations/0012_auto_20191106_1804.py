# Generated by Django 2.0.1 on 2019-11-06 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaire', '0011_presurvey_job'),
    ]

    operations = [
        migrations.CreateModel(
            name='registrationForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('alreadyParticipated_bool', models.TextField(blank=True, default='', null=True)),
                ('interestedInDevelopment_bool', models.TextField(blank=True, default='', null=True)),
                ('influenceOverDevelopment_bool', models.TextField(blank=True, default='', null=True)),
            ],
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI00',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI01',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI02',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI03',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI04',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI05',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI06',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI07',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI08',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI09',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI10',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI11',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI12',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI13',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI14',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI15',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI16',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI17',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI18',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI19',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI20',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI21',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI22',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI23',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI24',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='postsurvey',
            name='IMI25',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]
