from abc import ABC, abstractmethod
from typing import Tuple

from payment.models import PaymentProviderChoices, Payment
from payment.services.wallet_pay import wallet_pay_invoice_get
from telegram.services import telegram_shop_message_send, \
    telegram_shop_create_invoice_link
from telegram.services.shop.inline_buttons import (
    PayWithWalletPayButton, PayWithTelegramInvoiceButton
)

__all__ = [
    "payment_providers"
]


class PaymentProvider(ABC):
    def __init__(self, provider: PaymentProviderChoices):
        self.provider = provider

    @abstractmethod
    def create_payment(self, *args, **kwargs) -> Tuple[str, dict]:
        pass

    @abstractmethod
    def send_payment_message(self, *args, **kwargs) -> None:
        pass


class WalletPayProvider(PaymentProvider):
    def __init__(self):
        super().__init__(PaymentProviderChoices.WALLET_PAY)

    def create_payment(
            self,
            payment: Payment,
            *args,
            **kwargs
    ) -> Tuple[str, dict]:
        wallet_pay_invoice = wallet_pay_invoice_get(
            payment=payment,
        )
        payment.transaction_id = wallet_pay_invoice.get("id")
        payment.additional_info = {
            "payment_link": wallet_pay_invoice.get("payLink"),
            "direct_payment_link": wallet_pay_invoice.get("directPayLink")
        }
        payment.payment_expiry = wallet_pay_invoice.get("expirationDateTime")
        payment.save()

        self.send_payment_message(payment=payment)

        return self.provider, payment.additional_info

    def send_payment_message(self, payment: Payment, *args, **kwargs):
        message = f"Order {payment.order.order_number} has been created! Please proceed with payment by clicking the button below. \n\nNote: Payment will expire on {payment.payment_expiry}"

        reply_markup = [
            [PayWithWalletPayButton(
                direct_payment_link=payment.additional_info.get(
                    "direct_payment_link"
                )
            ).as_json()]
        ]

        telegram_shop_message_send(
            chat_id=payment.order.user.telegram_id,
            text=message,
            reply_markup=reply_markup,
            parse_mode=None
        )


class TelegramPaymentsProvider(PaymentProvider):
    def __init__(self):
        super().__init__(PaymentProviderChoices.TELEGRAM_INVOICE)

    def create_payment(
            self,
            payment: Payment,
            *args,
            **kwargs
    ) -> Tuple[str, dict]:
        payment_link = telegram_shop_create_invoice_link(payment=payment)
        payment.additional_info = {
            "payment_link": payment_link
        }

        payment.save()
        self.send_payment_message(payment=payment)

        return self.provider, payment.additional_info

    def send_payment_message(self, payment: Payment, *args, **kwargs) -> None:
        message = (
            f"Order {payment.order.order_number} has been created! "
            f"Please proceed with payment by clicking the button below"
        )

        reply_markup = [
            [PayWithTelegramInvoiceButton(
                payment_link=payment.additional_info.get("payment_link"),
                name=payment.payment_method.name
            ).as_json()]
        ]

        telegram_shop_message_send(
            chat_id=payment.order.user.telegram_id,
            text=message,
            reply_markup=reply_markup,
            parse_mode=None
        )


class CryptoPaymentProvider(PaymentProvider):
    def __init__(self):
        super().__init__(PaymentProviderChoices.CRYPTO_TRANSFER)

    def create_payment(
            self,
            payment: Payment,
            *args,
            **kwargs
    ) -> Tuple[str, dict]:
        self.send_payment_message(payment=payment)

        return (
            payment.payment_method.provider,
            payment.payment_method.other_info
        )

    def send_payment_message(self, payment: Payment, *args, **kwargs) -> None:
        wallet_address = payment.payment_method.other_info.get("address")
        network = payment.payment_method.other_info.get("network")
        message = (
            f"Order {payment.order.order_number} has been created! "
            f"Please proceed with payment by sending the required "
            f"amount to the provided address and network "
            f"\n\nAddress: {wallet_address}\nNetwork: {network}"
            f"\nAmount: {payment.currency + str(payment.total_amount)}"
            f"\nComment: {payment.order.order_number}"
        )

        telegram_shop_message_send(
            chat_id=payment.order.user.telegram_id,
            text=message,
            parse_mode=None
        )


class BankTransferPaymentProvider(PaymentProvider):
    def __init__(self):
        super().__init__(PaymentProviderChoices.BANK_TRANSFER)

    def create_payment(
            self,
            payment: Payment,
            *args,
            **kwargs
    ) -> Tuple[str, dict]:
        self.send_payment_message(payment=payment)

        return (
            payment.payment_method.provider,
            payment.payment_method.other_info
        )

    def send_payment_message(self, payment: Payment, *args, **kwargs):
        message = (
            f"Order {payment.order.order_number} has been created! "
            f"Please proceed with payment"
            f"\n\n {payment.payment_method.other_info.get('message')} "
            f"\n\nAmount: {payment.currency + str(payment.total_amount)}"
            f"\n\nComment: {payment.order.order_number}"
        )

        telegram_shop_message_send(
            chat_id=payment.order.user.telegram_id,
            text=message,
            parse_mode=None
        )


payment_providers = [
    WalletPayProvider(),
    TelegramPaymentsProvider(),
    CryptoPaymentProvider(),
    BankTransferPaymentProvider()
]
