import logging

import graphene
from graphene_django import DjangoObjectType

from order.services.order_services import (
    order_create
)
from order.models import Order, OrderStatusChoices

__all__ = [
    "OrderStatus",
    "OrderType",
    "OrderCreateMutation",
    "Query",
    "Mutation"
]

OrderStatus = graphene.Enum.from_enum(OrderStatusChoices, name="OrderStatus")


class OrderType(DjangoObjectType):
    user = graphene.Field('user.schemas.TelegramUserType')
    cart = graphene.Field('cart.schemas.CartType')
    shipping_details = graphene.Field('order.schemas.ShippingDetailsType')
    order_status = graphene.Field('order.schemas.OrderStatus')
    has_default_shipping_details = graphene.Boolean()
    delivery_amount = graphene.Decimal()

    class Meta:
        model = Order
        fields = "__all__"

    def resolve_has_default_shipping_details(self, info):
        return self.user.has_default_shipping_details


class OrderCreateMutation(graphene.Mutation):
    order = graphene.Field("order.schemas.OrderType")

    class Arguments:
        user_id = graphene.UUID()
        cart_id = graphene.UUID(required=True)

    def mutate(self, info, user_id, cart_id, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Creating order", {"cart_id": cart_id})
        order = order_create(user_id=user_id, cart_id=cart_id)
        return OrderCreateMutation(order=order)


class Query(graphene.ObjectType):
    orders = graphene.List(OrderType)
    order_get_by_id = graphene.Field(OrderType, order_id=graphene.UUID(required=True), state=graphene.String())
    order_get_by_cart_id = graphene.Field(OrderType, cart_id=graphene.UUID(required=True), state=graphene.String())

    def resolve_orders(self, info, **kwargs):
        orders = Order.objects.all()
        return orders

    def resolve_order_get_by_id(self, info, order_id, state=None):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Getting order by id", {"id": order_id})

        order_queryset = Order.objects.filter(pk=order_id)

        if state:
            order_queryset = order_queryset.filter(state=state)

        order = order_queryset.first()

        return order

    def resolve_order_get_by_cart_id(self, info, cart_id, state=None):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Getting order by cart id", {"cart_id": cart_id})

        order_queryset = Order.objects.filter(cart_id=cart_id)

        if state:
            order_queryset = order_queryset.filter(state=state)

        order = order_queryset.first()

        return order


class Mutation(graphene.ObjectType):
    order_create = OrderCreateMutation.Field()
