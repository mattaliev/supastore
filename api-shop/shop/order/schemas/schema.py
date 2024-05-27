from decimal import Decimal

import graphene
from graphene_django import DjangoObjectType

from core.schemas import PaginatedType
from order.models import (
    FulfillmentStatusChoices,
    Order,
)
from payment.models import PaymentStatusChoices

__all__ = [
    "PaymentStatus",
    "FulfillmentStatus",
    "OrderType",
    "OrderPaginatedType",
    "OrderStatusUpdateInput"
]


PaymentStatus = graphene.Enum.from_enum(
    PaymentStatusChoices,
    name="PaymentStatus"
)
FulfillmentStatus = graphene.Enum.from_enum(
    FulfillmentStatusChoices,
    name="FulfillmentStatus"
)


class OrderType(DjangoObjectType):
    user = graphene.Field('user.schemas.TelegramUserType')
    cart = graphene.Field('cart.schemas.CartType')
    store = graphene.Field('store.schemas.StoreType')
    has_default_shipping_details = graphene.Boolean()
    shipping = graphene.Field("shipping.schemas.ShippingType")
    payment = graphene.Field("payment.schemas.schema.PaymentType")
    state = graphene.String()
    shipping_amount = graphene.Decimal()
    subtotal_amount = graphene.Decimal()
    total_amount = graphene.Decimal()
    fulfilment_status = graphene.String()

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "fulfilment_status", "fulfilment_date",
            "user", "cart", "store",
            "has_default_shipping_details",
            "shipping", "payment", "state", "created", "updated"
        ]

    def resolve_has_default_shipping_details(self, info):
        if hasattr(self, "shipping"):
            return self.shipping.details is not None

        return False

    def resolve_shipping(self, info):
        if hasattr(self, "shipping"):
            return self.shipping
        return None

    def resolve_payment(self, info):
        if hasattr(self, "payment"):
            return self.payment
        return None

    def resolve_shipping_amount(self, info):
        if hasattr(self, "payment"):
            return self.payment.shipping_amount

        if self.shipping:
            return self.shipping.shipping_amount

    def resolve_subtotal_amount(self, info):
        if hasattr(self, "payment"):
            return Decimal(self.payment.subtotal_amount)

        return Decimal(self.cart.get_total_price())

    def resolve_total_amount(self, info):
        if hasattr(self, "payment"):
            return Decimal(self.payment.total_amount)

        return Decimal(self.cart.get_total_price()) + Decimal(self.shipping.shipping_amount)


class OrderPaginatedType(PaginatedType):
    objects = graphene.List("order.schemas.OrderType")


class OrderStatusUpdateInput(graphene.InputObjectType):
    store_id = graphene.UUID(required=True)
    order_id = graphene.UUID(required=True)
    fulfilment_status = graphene.String()
    notify_customer = graphene.Boolean()
