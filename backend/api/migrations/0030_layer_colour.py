# Generated by Django 3.1.2 on 2021-03-23 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_layer_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='layer',
            name='colour',
            field=models.TextField(default=''),
        ),
    ]
