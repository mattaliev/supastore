from payment.models import Payment
from payment.models import PaymentStatusChoices
from .payment_services import payment_status_update


def telegram_successful_payment_process(successful_payment):
    payment_id = successful_payment["invoice_payload"]
    provider_payment_charge_id = successful_payment[
        "provider_payment_charge_id"
    ]

    payment = Payment.objects.get(pk=payment_id)
    payment.transaction_id = provider_payment_charge_id
    payment.save()

    payment_status_update(
        payment_id=payment.id,
        payment_status=PaymentStatusChoices.PAID,
        notify_customer=True
    )
