from django.db import models

from core.models import BaseEntity


class TokenBlacklist(BaseEntity):
    jti = models.UUIDField()
    user = models.ForeignKey("user.TelegramUser", on_delete=models.CASCADE)

    class Meta:
        db_table = "token_blacklist"
        verbose_name = "Token Blacklist"
        verbose_name_plural = "Token Blacklist"
        unique_together = ("jti", "user")

