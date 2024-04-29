import graphene

from core.utils import get_paginator
from order.schemas.schema import OrderType, OrderPaginatedType
from order.services import order_list, order_get_by_id, order_get_by_cart_id

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    orders = graphene.List(OrderType)
    order_get_by_id = graphene.Field(
        OrderType,
        order_id=graphene.UUID(required=True),
        state=graphene.String()
    )
    order_get_by_cart_id = graphene.Field(
        OrderType,
        cart_id=graphene.UUID(required=True),
        state=graphene.String()
    )
    orders_paginated_get = graphene.Field(
        OrderPaginatedType,
        payment_status=graphene.String(),
        fulfilment_status=graphene.String(),
        state=graphene.String(),
        page=graphene.Int(),
        limit=graphene.Int()
    )

    def resolve_orders(self, info, **kwargs):
        return order_list()

    def resolve_order_get_by_id(self, info, order_id, state=None):
        return order_get_by_id(order_id=order_id, state=state)

    def resolve_order_get_by_cart_id(self, info, cart_id, state=None):
        return order_get_by_cart_id(cart_id=cart_id, state=state)

    def resolve_orders_paginated_get(
            self,
            info,
            payment_status=None,
            fulfilment_status=None,
            state=None,
            page=1,
            limit=10,
            **kwargs
    ):
        orders = order_list(
            payment_status=payment_status,
            fulfilment_status=fulfilment_status,
            state=state
        )
        return get_paginator(orders, limit, page, OrderPaginatedType)
