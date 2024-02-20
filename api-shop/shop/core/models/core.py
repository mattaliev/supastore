import uuid

from django.db import models


class EntityStateChoices(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"
    DELETED = "DELETED", "Deleted"


class BaseModel(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)

    class Meta:
        abstract = True


class BaseEntity(BaseModel):
    state = models.CharField(max_length=10, choices=EntityStateChoices.choices, default=EntityStateChoices.ACTIVE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    @property
    def is_active(self):
        return self.state == "ACTIVE"


class Image(BaseModel):
    url = models.URLField(max_length=255, unique=True)

    class Meta:
        db_table = "images"
        verbose_name = "image"
        verbose_name_plural = "images"
