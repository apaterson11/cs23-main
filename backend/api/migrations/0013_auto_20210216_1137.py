# Generated by Django 3.1.2 on 2021-02-16 11:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20210216_1114'),
    ]

    operations = [
        migrations.AlterField(
            model_name='landmarkimage',
            name='image',
            field=models.ImageField(default=None, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='landmarkimage',
            name='landmark',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, parent_link=True, related_name='landmark', to='api.landmark'),
        ),
    ]
