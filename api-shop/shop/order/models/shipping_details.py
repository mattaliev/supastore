from django.db import models

from core.models.core import BaseEntity

__all__ = [
    "ShippingDetails",
]


class ShippingDetails(BaseEntity):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    country = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    postcode = models.CharField(max_length=50)
    phone = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "shipping_details"
        verbose_name = "shipping details"
        verbose_name_plural = "shipping details"
        ordering = ["-created"]
