import logging
from uuid import UUID

from core.models import EntityStateChoices
from core.utils.encryption import encrypt
from order.models import Order
from payment.models import PaymentMethod, Payment, PaymentProviderChoices
from payment.models import PaymentStatusChoices
from payment.models.providers import payment_providers
from telegram.services.shop.marketing import \
    telegram_order_confirmation_to_admin_send

__all__ = [
    "payment_method_list",
    "payment_method_create",
    "payment_method_update",
    "payment_method_delete",
    "payment_create",
]


def payment_method_list(
        state: EntityStateChoices = None
) -> list[PaymentMethod]:
    if state:
        return PaymentMethod.objects.filter(state=state)
    return PaymentMethod.objects.all()


def payment_method_create(
        *,
        name: str,
        provider: PaymentProviderChoices,
        other_info: dict
) -> PaymentMethod:
    if provider == PaymentProviderChoices.WALLET_PAY:
        other_info["api_key"] = encrypt(other_info.get("api_key"))

    if provider == PaymentProviderChoices.TELEGRAM_INVOICE:
        other_info["provider_token"] = encrypt(other_info.get("provider_token"))

    return PaymentMethod.objects.create(
        name=name,
        provider=provider,
        other_info=other_info
    )


def payment_method_update(
        *,
        payment_method_id: UUID,
        name: str,
        provider: PaymentProviderChoices,
        other_info: dict
):
    payment_method = PaymentMethod.objects.get(pk=payment_method_id)

    if provider == PaymentProviderChoices.WALLET_PAY:
        other_info["api_key"] = encrypt(other_info.get("api_key"))

    if provider == PaymentProviderChoices.TELEGRAM_INVOICE:
        other_info["provider_token"] = encrypt(other_info.get("provider_token"))

    payment_method.name = name
    payment_method.provider = provider
    payment_method.other_info = other_info
    payment_method.save()
    return payment_method


def payment_method_delete(*, payment_method_id: UUID) -> bool:
    payment_method = PaymentMethod.objects.get(pk=payment_method_id)
    payment_method.delete()
    return True


def payment_create(
        *,
        order_id: UUID,
        payment_method_id: UUID,
        currency: str = "USD"
) -> tuple[str, dict]:
    payment_method = PaymentMethod.objects.get(pk=payment_method_id)
    order = Order.objects.get(pk=order_id)

    if not payment_method or not order:
        raise ValueError("Payment method or order not found")

    # Create payment
    if hasattr(order, "payment"):
        previous_payment = order.payment
        previous_payment.order = None
        previous_payment.save()
        order.save()

    payment = Payment.objects.create(
        order=order,
        payment_method=payment_method,
        currency=currency
    )

    for provider in payment_providers:
        if provider.provider == payment_method.provider:
            return provider.create_payment(payment=payment)


def payment_status_update(
        *,
        payment_id: UUID,
        payment_status: PaymentStatusChoices,
        notify_customer: bool
) -> Payment:
    logger = logging.getLogger(__name__)
    logger.debug(
        "Updating order payment status. Payment Id: %s Status: %s",
        payment_id,
        payment_status
    )

    payment = Payment.objects.filter(pk=payment_id).first()

    if payment is None:
        raise ValueError("Order not found")

    if payment_status == PaymentStatusChoices.PAID:
        payment.order.state = EntityStateChoices.INACTIVE
        payment.order.cart.state = EntityStateChoices.INACTIVE
        payment.order.save()
        payment.order.cart.save()
        telegram_order_confirmation_to_admin_send(order=payment.order)

    payment.payment_status = payment_status
    payment.save()

    if notify_customer:
        pass
        # telegram_notify_customer_about_status_change(payment=payment)

    return payment
