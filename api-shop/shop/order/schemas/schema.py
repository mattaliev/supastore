import graphene
from graphene_django import DjangoObjectType

from core.schemas import PaginatedType
from order.models import (
    PaymentStatusChoices,
    FulfillmentStatusChoices,
    Order,
    OrderItem
)

__all__ = [
    "PaymentStatus",
    "FulfillmentStatus",
    "OrderType",
    "OrderItemType",
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
    items = graphene.List('order.schemas.OrderItemType', required=True)
    payment_status = graphene.String()
    fulfilment_status = graphene.String()
    has_default_shipping_details = graphene.Boolean()
    delivery_amount = graphene.Decimal()
    shipping = graphene.Field("shipping.schemas.ShippingType")
    state = graphene.String()

    class Meta:
        model = Order
        fields = "__all__"

    def resolve_items(self, info):
        return self.items.all()

    def resolve_has_default_shipping_details(self, info):
        if self.user is None:
            return False

        return self.user.has_default_shipping_details

    def resolve_shipping(self, info):
        return self.shipping


class OrderItemType(DjangoObjectType):
    product = graphene.Field('product.schemas.ProductType', required=True)
    variant = graphene.Field('product.schemas.ProductVariantType')

    class Meta:
        model = OrderItem
        fields = ["id", "product", "variant", "quantity", "created", "updated"]

    def resolve_product(self, info):
        return self.product

    def resolve_variant(self, info):
        return self.variant


class OrderPaginatedType(PaginatedType):
    objects = graphene.List("order.schemas.OrderType")


class OrderStatusUpdateInput(graphene.InputObjectType):
    order_id = graphene.UUID(required=True)
    payment_status = graphene.String()
    fulfilment_status = graphene.String()
    notify_customer = graphene.Boolean()
