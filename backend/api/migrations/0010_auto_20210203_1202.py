# Generated by Django 3.1.2 on 2021-02-03 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20210203_1130'),
    ]

    operations = [
        migrations.AlterField(
            model_name='landmark',
            name='markertype',
            field=models.TextField(default=''),
        ),
    ]