# Generated by Django 3.1.2 on 2021-02-03 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_landmark_markertype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='landmark',
            name='markertype',
            field=models.TextField(default='knowledge'),
        ),
    ]
