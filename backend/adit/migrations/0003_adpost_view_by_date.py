# Generated by Django 2.1.11 on 2019-11-24 01:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adit', '0002_adpost_open_for_all'),
    ]

    operations = [
        migrations.AddField(
            model_name='adpost',
            name='view_by_date',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
