import graphene
from graphene_django import DjangoObjectType

from core.schemas import PaginatedType
from order.models import (
    FulfillmentStatusChoices,
    Order,
)

__all__ = [
    "PaymentStatus",
    "FulfillmentStatus",
    "OrderType",
    "OrderPaginatedType",
    "OrderStatusUpdateInput"
]

from payment.models import PaymentStatusChoices

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
    has_default_shipping_details = graphene.Boolean()
    shipping = graphene.Field("shipping.schemas.ShippingType")
    state = graphene.String()

    class Meta:
        model = Order
        fields = "__all__"

    def resolve_has_default_shipping_details(self, info):
        if self.user is None:
            return False

        return self.user.has_default_shipping_details

    def resolve_shipping(self, info):
        return self.shipping


class OrderPaginatedType(PaginatedType):
    objects = graphene.List("order.schemas.OrderType")


class OrderStatusUpdateInput(graphene.InputObjectType):
    order_id = graphene.UUID(required=True)
    fulfilment_status = graphene.String()
    notify_customer = graphene.Boolean()
