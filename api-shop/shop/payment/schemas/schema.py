import graphene
from graphene_django import DjangoObjectType

from payment.models import PaymentMethod

__all__ = [
    "PaymentMethodType",
    "PaymentMethodCreateInput",
    "PaymentMethodUpdateInput",
    "PaymentCreateInput"
]


class PaymentMethodType(DjangoObjectType):
    state = graphene.String()

    class Meta:
        model = PaymentMethod
        fields = ["id", "name", "provider", "state", "created"]
        description = "Payment method"


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


class PaymentStatusUpdate(graphene.InputObjectType):
    payment_id = graphene.UUID(required=True)
    payment_status = graphene.String(required=True)
    notify_customer = graphene.Boolean()
