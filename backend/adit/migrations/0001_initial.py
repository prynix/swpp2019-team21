from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0009_alter_user_last_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AditUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email')),
                ('nickname', models.CharField(default='', max_length=10, unique=True, verbose_name='Nickname')),
                ('avatar', models.ImageField(default='image/avatar/default_avatar.png', upload_to='image/avatar/')),
                ('first_name', models.CharField(default='', max_length=10, verbose_name='Firstname')),
                ('last_name', models.CharField(default='', max_length=10, verbose_name='Lastname')),
                ('point', models.IntegerField()),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AdPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
                ('subtitle', models.CharField(max_length=64)),
                ('content', models.TextField()),
                ('open_for_all', models.BooleanField(default=True)),
                ('ad_link', models.TextField()),
                ('closed', models.BooleanField()),
                ('target_views', models.IntegerField()),
                ('total_views', models.IntegerField()),
                ('upload_date', models.DateTimeField()),
                ('expiry_date', models.DateField()),
                ('view_by_date', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='AdReception',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('views', models.IntegerField()),
                ('unique_link', models.TextField()),
                ('closed', models.BooleanField()),
                ('recept_time', models.DateTimeField()),
                ('adpost', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='toreception', to='adit.AdPost')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='toreception', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='InterestedTags',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=20)),
                ('usercount', models.IntegerField()),
                ('postcount', models.IntegerField()),
                ('created_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='IpAddressDuplication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip_address', models.CharField(max_length=16)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='PostImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(null=True, upload_to='image/adpost/postimage')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('checked', models.BooleanField()),
                ('adpost', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question', to='adit.AdPost')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='adpost',
            name='image',
            field=models.ManyToManyField(related_name='topost', to='adit.PostImage'),
        ),
        migrations.AddField(
            model_name='adpost',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='adpost',
            name='tags',
            field=models.ManyToManyField(related_name='topost', to='adit.InterestedTags'),
        ),
        migrations.AddField(
            model_name='adpost',
            name='thumbnail',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='thumbnail_topost', to='adit.PostImage'),
        ),
        migrations.AddField(
            model_name='adituser',
            name='tags',
            field=models.ManyToManyField(related_name='touser', to='adit.InterestedTags'),
        ),
        migrations.AddField(
            model_name='adituser',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]
