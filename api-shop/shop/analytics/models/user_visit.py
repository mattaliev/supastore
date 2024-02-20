from django.db import models
from core.models import BaseEntity

__all__ = [
    "UserVisit",
]


class UserVisit(BaseEntity):
    user = models.ForeignKey(
        "user.TelegramUser",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="visits"
    )

    class Meta:
        db_table = "user_visit"
        verbose_name = "User Visit"
        verbose_name_plural = "User Visits"
