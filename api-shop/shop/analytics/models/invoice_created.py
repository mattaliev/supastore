from django.db import models

from core.models import BaseEntity


__all__ = [
    "InvoiceCreated",
]


class InvoiceCreated(BaseEntity):
    order = models.ForeignKey(
        "order.Order",
        on_delete=models.CASCADE,
        related_name="invoice_created"
    )

    class Meta:
        db_table = "invoice_created"
        verbose_name = "Invoice Created"
        verbose_name_plural = "Invoice Created"
        ordering = ["-created"]
