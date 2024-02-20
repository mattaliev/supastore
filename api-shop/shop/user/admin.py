from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from user.models.user import TelegramUser


@admin.register(TelegramUser)
class CustomUserAdmin(UserAdmin):
    model = TelegramUser
    # Optionally customize the admin form here
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('telegram_id',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('telegram_id',)}),
    )
