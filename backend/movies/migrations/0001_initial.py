from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.IntegerField(unique=True)),
                ('title', models.CharField(max_length=200)),
                ('overview', models.TextField()),
                ('poster_path', models.CharField(max_length=200, null=True, blank=True)),
                ('release_date', models.CharField(max_length=10)),
                ('vote_average', models.FloatField()),
                ('genres', models.JSONField(default=list)),
            ],
        ),
    ]
