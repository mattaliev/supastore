from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models.core import BaseEntity


__all__ = [
    "TelegramUser",
    "UserRoleChoices",
]


class UserRoleChoices(models.TextChoices):
    ADMIN = "ADMIN", "ADMIN"
    USER = "USER", "USER"


class TelegramUser(AbstractUser, BaseEntity):
    username = models.CharField(max_length=100, blank=True, null=True, unique=False)
    telegram_id = models.IntegerField(unique=True)
    language_code = models.CharField(max_length=10, blank=True, null=True)
    is_bot = models.BooleanField(default=False)
    photo_url = models.URLField(blank=True, null=True)
    allows_notifications = models.BooleanField(default=False)
    role = models.CharField(
        max_length=50,
        choices=UserRoleChoices.choices,
        default=UserRoleChoices.USER
    )
    shipping_details = models.OneToOneField(
        "order.ShippingDetails",
        on_delete=models.CASCADE,
        related_name="user",
        blank=True,
        null=True,
    )
    USERNAME_FIELD = "telegram_id"

    class Meta:
        db_table = "telegram_user"
        verbose_name = "Telegram User"
        verbose_name_plural = "Telegram Users"

    @property
    def has_default_shipping_details(self):
        return self.shipping_details is not None

