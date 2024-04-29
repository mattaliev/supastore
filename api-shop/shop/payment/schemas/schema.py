import graphene
from graphene_django import DjangoObjectType

from payment.models import PaymentMethod, Payment

__all__ = [
    "PaymentMethodType",
    "PaymentType",
    "PaymentMethodCreateInput",
    "PaymentMethodUpdateInput",
    "PaymentCreateInput"
]


class PaymentMethodType(DjangoObjectType):
    state = graphene.String()

    class Meta:
        model = PaymentMethod
        fields = "__all__"
        description = "Payment method"


class PaymentType(DjangoObjectType):
    state = graphene.String()

    class Meta:
        model = Payment
        fields = ["id", "order", "payment_method", "payment_status",
                  "subtotal_amount", "shipping_amount", "total_amount",
                  "currency", "transaction_id", "payment_date",
                  "payment_expiry", "additional_info", "state",
                  "created", "updated"]
        description = "Payment"


class PaymentMethodCreateInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    provider = graphene.String(required=True)
    other_info = graphene.JSONString()


class PaymentMethodUpdateInput(PaymentMethodCreateInput):
    payment_method_id = graphene.UUID(required=True)


class PaymentCreateInput(graphene.InputObjectType):
    order_id = graphene.UUID(required=True)
    payment_method_id = graphene.UUID(required=True)
    currency = graphene.String()
    notify_customer = graphene.Boolean()


class PaymentStatusUpdateInput(graphene.InputObjectType):
    payment_id = graphene.UUID(required=True)
    payment_status = graphene.String(required=True)
    notify_customer = graphene.Boolean()
