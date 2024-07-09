from django.db import models

from core.models import BaseEntity

__all__ = [
    "Store",
    "StoreBot",
    "StoreLogo",
    "StoreApplication",
    "StoreSupportBot"
]


class Store(BaseEntity):
    store_name = models.TextField(max_length=100)
    store_description = models.TextField(max_length=255, null=True, blank=True)
    store_timezone = models.TextField(max_length=100, default="UTC")
    is_connected_to_telegram = models.BooleanField(default=False)
    store_url = models.URLField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "store"
        verbose_name = "Store"
        verbose_name_plural = "Stores"


class StoreBot(BaseEntity):
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name="store_bot")
    bot_username = models.TextField(max_length=100, null=True, blank=True)
    token = models.TextField(max_length=255, null=True, blank=True)
    telegram_store_url = models.URLField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "store_bot"
        verbose_name = "Store Bot"
        verbose_name_plural = "Store Bots"


class StoreLogo(BaseEntity):
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name="logo")
    logo_dark = models.ImageField(upload_to="store_logos", null=True, blank=True)
    logo_light = models.ImageField(upload_to="store_logos", null=True, blank=True)

    class Meta:
        db_table = "store_logo"
        verbose_name = "Store Logo"
        verbose_name_plural = "Store Logos"
        ordering = ["-created"]
        unique_together = ["store"]


class StoreApplication(BaseEntity):
    store_name = models.TextField(max_length=100)
    store_description = models.TextField(max_length=255, null=True, blank=True)
    channels = models.TextField(max_length=255, null=True, blank=True)
    product_category = models.TextField(max_length=255, null=True, blank=True)
    user = models.ForeignKey("user.TelegramUser", on_delete=models.CASCADE, related_name="store_applications")

    class Meta:
        db_table = "store_application"
        verbose_name = "Store Application"
        verbose_name_plural = "Store Applications"
        ordering = ["-created"]
        unique_together = ["store_name", "user"]


class StoreSupportBot(BaseEntity):
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name="support_bot")
    bot_username = models.CharField(max_length=100, null=True, blank=True)
    bot_token = models.CharField(max_length=255, null=True, blank=True)
    group_chat_id = models.IntegerField(null=True, blank=True)
    message_thread_id = models.IntegerField(null=True, blank=True)
    greeting_message = models.TextField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "store_support_bot"
        verbose_name = "Store Support Bot"
        verbose_name_plural = "Store Support Bots"
        ordering = ["-created"]
