from django.db import models
from core.models import BaseEntity


__all__ = [
    "OrderCreated",
]


class OrderCreated(BaseEntity):
    order = models.ForeignKey(
        "order.Order",
        on_delete=models.CASCADE,
        related_name="order_created"
    )

    class Meta:
        db_table = "order_created"
        verbose_name = "Order Created"
        verbose_name_plural = "Order Created"
        ordering = ["-created"]
