from datetime import timedelta
from decimal import Decimal

from django.utils import timezone
from graphene import UUID

from payment.models import Payment, PaymentStatusChoices

__all__ = [
    "sales_analytics_get"
]


def sales_analytics_get(*, store_id: UUID):
    payments = Payment.objects.filter(
        payment_status=PaymentStatusChoices.PAID,
        order__store__id=store_id
    )

    # Get today's date
    today = timezone.now()

    # Calculate the start of the week. Meaning finding a period
    # from the start of the week to today
    current_week_start = today - timedelta(days=today.weekday()) - timedelta(
        hours=today.hour)
    current_week = [current_week_start, today]

    # Calculate the end of the week
    last_week_start = current_week_start - timedelta(weeks=1)
    last_week = [last_week_start, today - timedelta(weeks=1)]

    # Calculate the start and end of the month
    current_month_start = today - timedelta(days=today.day)
    current_month = [current_month_start, today]

    last_month_start = current_month_start - timedelta(days=30)
    last_month = [last_month_start, today - timedelta(days=30)]

    # Filter orders
    orders_this_week = payments.filter(created__range=current_week)
    orders_this_month = payments.filter(created__range=current_month)
    orders_last_week = payments.filter(created__range=last_week)
    orders_last_month = payments.filter(created__range=last_month)

    sales_this_week = Decimal(sum(
        [order.total_amount for order in orders_this_week]
    ))
    sales_this_month = Decimal(sum(
        [order.total_amount for order in orders_this_month]
    ))
    sales_last_week = Decimal(sum(
        [order.total_amount for order in orders_last_week]
    ))
    sales_last_month = Decimal(sum(
        [order.total_amount for order in orders_last_month]
    ))

    sales_increase_this_week = calculate_percentage_increase(
        sales_this_week, sales_last_week
    )

    sales_increase_this_month = calculate_percentage_increase(
        sales_this_month, sales_last_month
    )

    return {
        "sales_this_week": sales_this_week,
        "sales_this_month": sales_this_month,
        "sales_increase_this_week": sales_increase_this_week,
        "sales_increase_this_month": sales_increase_this_month,
    }


def calculate_percentage_increase(current: Decimal, last: Decimal) -> Decimal:
    if last == 0 and current == 0:
        return Decimal("0.00")
    if last == 0:
        return Decimal("100.0")
    return ((current - last) / last) * 100
