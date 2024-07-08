from django.contrib.postgres.fields import ArrayField
from django.db import models

from core.models import BaseEntity

__all__ = [
    "ManualMailingAudienceChoices",
    "ManualMailing",
    "ManualMailingFiles"
]


class ManualMailingAudienceChoices(models.TextChoices):
    ALL = "ALL", "ALL"
    NEW = "NEW", "NEW"
    ADDED_TO_CART = "ADDED_TO_CART", "ADDED_TO_CART"
    STARTED_CHECKOUT = "STARTED_CHECKOUT", "STARTED_CHECKOUT"
    PURCHASED = "PURCHASED", "PURCHASED"


def default_audience():
    return list([ManualMailingAudienceChoices.ALL])


class ManualMailing(BaseEntity):
    store = models.ForeignKey(to="store.Store", null=True, blank=True, related_name="mailings", on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    message = models.TextField()
    audience = ArrayField(
        models.CharField(max_length=50, choices=ManualMailingAudienceChoices.choices)
        , default=default_audience, blank=True
    )
    cta_text = models.CharField(max_length=50)
    cta_url = models.URLField(max_length=255)
    user_count = models.IntegerField(default=0)
    successful_send_count = models.IntegerField(default=0)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Manual Mailing"
        verbose_name_plural = "Manual Mailings"
        ordering = ["-created"]
        db_table = "manual_mailings"


class ManualMailingFiles(BaseEntity):
    mailing = models.ForeignKey(to="marketing.ManualMailing", related_name="files", on_delete=models.CASCADE)
    send_as_file = models.BooleanField(default=False)
    file = models.FileField(upload_to="manual_mailing_files")

    class Meta:
        verbose_name = "Manual Mailing File"
        verbose_name_plural = "Manual Mailing Files"
        ordering = ["-created"]
        db_table = "manual_mailing_files"
