import logging
from uuid import UUID

from django.utils import timezone

from analytics.models import Event
from core.models import EntityStateChoices
from core.utils.encryption import encrypt
from order.models import Order, FulfillmentStatusChoices
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
    "payment_status_update"
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
        button_text: str,
        other_info: dict,
        state: EntityStateChoices = EntityStateChoices.ACTIVE
) -> PaymentMethod:
    try:
        if provider == PaymentProviderChoices.WALLET_PAY:
            other_info["api_key"] = encrypt(other_info.get("apiKey"))
            del other_info["apiKey"]

        if provider == PaymentProviderChoices.TELEGRAM_INVOICE:
            other_info["provider_token"] = encrypt(other_info.get("providerToken"))
            del other_info["providerToken"]

        return PaymentMethod.objects.create(
            name=name,
            provider=provider,
            other_info=other_info,
            button_text=button_text,
            state=state
        )
    except Exception as e:
        print(e)
        raise e


def payment_method_update(
        *,
        payment_method_id: UUID,
        name: str,
        button_text: str,
        provider: PaymentProviderChoices,
        other_info: dict,
        state: EntityStateChoices = EntityStateChoices.ACTIVE
):
    payment_method = PaymentMethod.objects.get(pk=payment_method_id)

    if provider == PaymentProviderChoices.WALLET_PAY:
        other_info["api_key"] = encrypt(other_info.get("apiKey"))
        del other_info["apiKey"]

    if provider == PaymentProviderChoices.TELEGRAM_INVOICE:
        other_info["provider_token"] = encrypt(other_info.get("providerToken"))
        del other_info["providerToken"]

    payment_method.name = name
    payment_method.provider = provider
    payment_method.other_info = other_info
    payment_method.button_text = button_text
    payment_method.state = state
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
        currency: str = "USD",
        notify_customer: bool = True
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
        currency=currency,
        subtotal_amount=order.cart.get_total_price(),
        shipping_amount=order.shipping.shipping_amount,
        total_amount=order.cart.get_total_price() + order.shipping.shipping_amount
    )

    payment_info = None

    for provider in payment_providers:
        if provider.provider == payment_method.provider:
            payment_info = provider.create_payment(payment=payment)
            if notify_customer:
                provider.send_payment_message(payment=payment)

    if not payment_info:
        raise ValueError("Payment provider not found")

    # Make order immutable. Once user creates and order it should not be changed
    order.state = EntityStateChoices.INACTIVE
    order.cart.state = EntityStateChoices.INACTIVE
    order.fulfilment_status = FulfillmentStatusChoices.PENDING

    order.save()
    order.cart.save()

    Event.register_payment_started(payment=payment)

    return payment_info


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
        if payment.order.fulfilment_status == FulfillmentStatusChoices.PENDING or \
                payment.order.fulfilment_status == FulfillmentStatusChoices.OPEN:
            payment.order.fulfilment_status = FulfillmentStatusChoices.UNFULFILLED
        payment.payment_date = timezone.now()
        payment.save()
        payment.order.save()
        telegram_order_confirmation_to_admin_send(order=payment.order)
        Event.register_payment_completed(payment=payment)

    payment.payment_status = payment_status
    payment.save()

    if notify_customer:
        pass
        # telegram_notify_customer_about_status_change(payment=payment)

    return payment
