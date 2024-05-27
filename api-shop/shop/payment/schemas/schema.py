import graphene
from graphene_django import DjangoObjectType

from core.utils.encryption import decrypt
from payment.models import PaymentMethod, Payment, PaymentProviderChoices

__all__ = [
    "PaymentMethodType",
    "PaymentType",
    "PaymentMethodCreateInput",
    "PaymentMethodUpdateInput",
    "PaymentCreateInput",
    "PaymentStatusUpdateInput"
]


class PaymentMethodType(DjangoObjectType):
    other_info = graphene.JSONString()
    state = graphene.String()
    store = graphene.Field("store.schemas.StoreType")

    class Meta:
        model = PaymentMethod
        fields = "__all__"
        description = "Payment method"

    def resolve_state(self, info):
        return self.state

    def resolve_other_info(self, info):
        other_info = self.other_info

        if self.provider == PaymentProviderChoices.WALLET_PAY:
            other_info["api_key"] = decrypt(other_info.get("api_key"))

        if self.provider == PaymentProviderChoices.TELEGRAM_INVOICE:
            other_info["provider_token"] = decrypt(other_info.get("provider_token"))

        return other_info

    def resolve_store(self, info):
        return self.store


class PaymentMethodSafeType(DjangoObjectType):
    state = graphene.String()
    store = graphene.Field("store.schemas.StoreType")

    class Meta:
        model = PaymentMethod
        fields = ["id", "name", "provider", "button_text", "state"]
        description = "Payment method"

    def resolve_state(self, info):
        return self.state

    def resolve_store(self, info):
        return self.store


class PaymentType(DjangoObjectType):
    state = graphene.String()
    payment_method = graphene.Field(PaymentMethodSafeType)

    class Meta:
        model = Payment
        fields = ["id", "order", "payment_method", "payment_status",
                  "subtotal_amount", "shipping_amount", "total_amount",
                  "currency", "transaction_id", "payment_date",
                  "payment_expiry", "additional_info", "state",
                  "created", "updated"]
        description = "Payment"


    def resolve_state(self, info):
        return self.state

    def resolve_payment_method(self, info):
        return self.payment_method


class PaymentMethodInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    provider = graphene.String(required=True)
    button_text = graphene.String()
    other_info = graphene.JSONString()
    state = graphene.String()


class PaymentMethodCreateInput(PaymentMethodInput):
    store_id = graphene.UUID(required=True)


class PaymentMethodUpdateInput(PaymentMethodCreateInput):
    payment_method_id = graphene.UUID(required=True)


class PaymentCreateInput(graphene.InputObjectType):
    order_id = graphene.UUID(required=True)
    payment_method_id = graphene.UUID(required=True)
    currency = graphene.String()
    notify_customer = graphene.Boolean()


class PaymentStatusUpdateInput(graphene.InputObjectType):
    store_id = graphene.UUID(required=True)
    payment_id = graphene.UUID(required=True)
    payment_status = graphene.String(required=True)
    notify_customer = graphene.Boolean()
