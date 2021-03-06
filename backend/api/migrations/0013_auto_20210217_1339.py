# Generated by Django 3.1.2 on 2021-02-17 13:39

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20210214_1946'),
    ]

    operations = [
        migrations.CreateModel(
            name='MapStyle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=64)),
                ('url', models.CharField(max_length=128)),
                ('min_zoom', models.IntegerField()),
                ('max_zoom', models.IntegerField()),
                ('attribution', models.CharField(max_length=128)),
            ],
        ),
        migrations.AddField(
            model_name='map',
            name='style',
            field=models.ForeignKey(null=True, on_delete=models.SET(api.models.get_default_style), related_name='maps', to='api.mapstyle'),
        ),
    ]
