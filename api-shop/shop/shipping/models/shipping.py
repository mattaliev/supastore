from decimal import Decimal

from django.db import models

from core.models.core import BaseEntity

__all__ = [
    "Shipping",
    "ShippingDetails",
    "ShippingAddress",
    "ContactInformation"
]


class Shipping(BaseEntity):
    contact_info = models.ForeignKey(
        "shipping.ContactInformation",
        on_delete=models.SET_NULL,
        related_name="shipping_label",
        null=True,
        blank=True
    )

    shipping_address = models.ForeignKey(
        "shipping.ShippingAddress",
        on_delete=models.SET_NULL,
        related_name="shipping_label",
        null=True,
        blank=True
    )

    shipping_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )

    carrier = models.CharField(max_length=50, null=True, blank=True)
    tracking_number = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "shipping"
        verbose_name = "shipping"
        verbose_name_plural = "shipping"
        ordering = ["-created"]

    def calculate_shipping_amount(self):
        if not self.details:
            return

        if self.details.country == "Indonesia" and self.details.province == "Bali":
            self.shipping_amount = Decimal("0.00")
        else:
            self.shipping_amount = Decimal("19.99")


class ShippingAddress(BaseEntity):
    store_user = models.ForeignKey("user.StoreUser", on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    additional_info = models.TextField(null=True, blank=True)


class ContactInformation(BaseEntity):
    store_user = models.ForeignKey("user.StoreUser", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)


class ShippingDetails(BaseEntity):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    country = models.CharField(max_length=50)
    province = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    postcode = models.CharField(max_length=50)
    phone = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "shipping_details"
        verbose_name = "shipping details"
        verbose_name_plural = "shipping details"
        ordering = ["-created"]
