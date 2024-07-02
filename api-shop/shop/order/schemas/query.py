import graphene

from core.exceptions import UNAUTHORIZED, UNAUTHENTICATED, AuthenticationError
from core.utils import get_paginator
from order.schemas.schema import OrderType, OrderPaginatedType
from order.services import order_list, order_get_by_id, order_get_by_cart_id

__all__ = [
    "Query"
]

from order.services.order_services import can_create_order

from store.services import can_manage_store


class Query(graphene.ObjectType):
    order_get_by_id = graphene.Field(
        OrderType,
        order_id=graphene.UUID(required=True),
        store_id=graphene.UUID(required=True),
        state=graphene.String(),
    )
    order_get_by_cart_id = graphene.Field(
        OrderType,
        cart_id=graphene.UUID(required=True),
        store_id=graphene.UUID(required=True),
        state=graphene.String()
    )
    orders_paginated_get = graphene.Field(
        OrderPaginatedType,
        store_id=graphene.UUID(required=True),
        payment_status=graphene.String(),
        fulfilment_status=graphene.String(),
        state=graphene.String(),
        page=graphene.Int(),
        limit=graphene.Int()
    )

    order_can_create = graphene.Boolean(store_id=graphene.UUID(required=True), cart_id=graphene.UUID(required=True))

    def resolve_order_get_by_id(self, info, order_id, store_id, state=None):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        order = order_get_by_id(order_id=order_id, store_id=store_id, state=state)

        if not order:
            return None

        if not user.can_access_resource(order) and not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        return order

    def resolve_order_get_by_cart_id(self, info, cart_id, store_id, state=None):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        order = order_get_by_cart_id(cart_id=cart_id, store_id=store_id, state=state)

        if not order:
            return None

        if not user.can_access_resource(order):
            raise UNAUTHORIZED()

        return order

    def resolve_orders_paginated_get(
            self,
            info,
            store_id,
            payment_status=None,
            fulfilment_status=None,
            state=None,
            page=1,
            limit=10,
            **kwargs
    ):
        user = info.context.user

        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        orders = order_list(
            store_id=store_id,
            payment_status=payment_status,
            fulfilment_status=fulfilment_status,
            state=state
        )
        return get_paginator(orders, limit, page, OrderPaginatedType)

    def resolve_order_can_create(self, info, store_id, cart_id):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        return can_create_order(user=user, store_id=store_id, cart_id=cart_id)
