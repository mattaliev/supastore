from django.db import models


__all__ = [
    "States",
    "UserBotState",
]


class States(models.TextChoices):
    """
    Enum for user bot states
    """
    JOIN_PROMO_CODE = "JOIN_PROMO_CODE", "JOIN_PROMO_CODE"
    SHOPPING = "SHOPPING", "SHOPPING"


class UserBotState(models.Model):
    """
    Model for user bot states
    """
    user = models.ForeignKey(
        "user.TelegramUser",
        on_delete=models.CASCADE,
        related_name="bot_states"
    )
    state = models.CharField(
        max_length=50,
        choices=States.choices,
        default=States.JOIN_PROMO_CODE
    )
    store = models.ForeignKey(
        "store.Store",
        on_delete=models.CASCADE,
        related_name="user_bot_states",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_bot_state"
        verbose_name = "User Bot State"
        verbose_name_plural = "User Bot States"
        unique_together = ("user", "state", "store")

    def __str__(self):
        return f"{self.user} - {self.state}"
