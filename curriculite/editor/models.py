from django.db import models

class Session(models.Model):
    name = models.CharField(max_length=50)
    xpos = models.IntegerField()
    ypos = models.IntegerField()
