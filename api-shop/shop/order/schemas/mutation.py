import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED
from order.schemas.schema import OrderStatusUpdateInput
from order.services import order_create, order_delete, \
    order_fulfilment_status_update

__all__ = [
    "OrderCreateMutation",
    "Mutation"
]

from user.models import UserRoleChoices


class OrderCreateMutation(graphene.Mutation):
    order = graphene.Field("order.schemas.OrderType")

    class Arguments:
        cart_id = graphene.UUID(required=True)

    def mutate(self, info, cart_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        order = order_create(user_id=user.id, cart_id=cart_id)
        return OrderCreateMutation(order=order)


class OrderUpdateMutation(graphene.Mutation):
    order = graphene.Field("order.schemas.OrderType")

    class Arguments:
        input = OrderStatusUpdateInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if user.role != UserRoleChoices.ADMIN:
            raise UNAUTHORIZED()

        order = order_fulfilment_status_update(**input)
        return OrderUpdateMutation(order=order)


class OrderDeleteMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        order_id = graphene.UUID(required=True)

    def mutate(self, info, order_id, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if user.role != UserRoleChoices.ADMIN:
            raise UNAUTHORIZED()

        success = order_delete(order_id=order_id)
        return OrderDeleteMutation(success=success)


class Mutation(graphene.ObjectType):
    order_create = OrderCreateMutation.Field()
    order_status_update = OrderUpdateMutation.Field()
    order_delete = OrderDeleteMutation.Field()
