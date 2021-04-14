from django.db import models

class Padlet(models.Model):
    p_content = models.CharField(max_length=1000)
    p_id = models.CharField(max_length=50, primary_key=True)
    allowed_users = models.CharField(max_length=500, default="[]")

# Create your models here.
