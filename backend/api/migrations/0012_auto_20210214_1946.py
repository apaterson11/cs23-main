# Generated by Django 3.1.2 on 2021-02-14 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20210214_1705'),
    ]

    operations = [
        migrations.AlterField(
            model_name='city',
            name='name',
            field=models.CharField(db_index=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='state',
            name='name',
            field=models.CharField(db_index=True, max_length=64),
        ),
    ]
