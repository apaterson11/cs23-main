# Generated by Django 3.1.2 on 2021-02-17 17:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_auto_20210217_1708'),
    ]

    operations = [
        migrations.AlterField(
            model_name='landmark',
            name='layer',
            field=models.ForeignKey(default=1, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='layer', to='api.layer'),
        ),
    ]
