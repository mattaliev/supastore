import graphene

from order.schemas.schema import OrderStatusUpdateInput
from order.services import order_create, order_status_update, order_delete

__all__ = [
    "OrderCreateMutation",
    "Mutation"
]


class OrderCreateMutation(graphene.Mutation):
    order = graphene.Field("order.schemas.OrderType")

    class Arguments:
        cart_id = graphene.UUID(required=True)
        user_id = graphene.UUID()

    def mutate(self, info, cart_id, user_id=None, **kwargs):
        order = order_create(user_id=user_id, cart_id=cart_id)
        return OrderCreateMutation(order=order)


class OrderUpdateMutation(graphene.Mutation):
    order = graphene.Field("order.schemas.OrderType")

    class Arguments:
        input = OrderStatusUpdateInput(required=True)

    def mutate(self, info, input, **kwargs):
        order = order_status_update(**input)
        return OrderUpdateMutation(order=order)


class OrderDeleteMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        order_id = graphene.UUID(required=True)

    def mutate(self, info, order_id, **kwargs):
        success = order_delete(order_id=order_id)
        return OrderDeleteMutation(success=success)


class Mutation(graphene.ObjectType):
    order_create = OrderCreateMutation.Field()
    order_status_update = OrderUpdateMutation.Field()
    order_delete = OrderDeleteMutation.Field()
