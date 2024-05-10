import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED
from core.utils import get_paginator
from user.models import UserRoleChoices
from user.services import customer_list_get, customer_detail_get
from .schema import TelegramUserType, TelegramUserPaginatedType

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    customer_list = graphene.List(TelegramUserType)
    customer_detail = graphene.Field(
        TelegramUserType,
        user_id=graphene.UUID(required=True)
    )
    customers_paginated = graphene.Field(
        TelegramUserPaginatedType,
        page=graphene.Int(),
        limit=graphene.Int(),
        sort_by=graphene.String()
    )

    def resolve_customer_list(self, info):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if user.role != UserRoleChoices.ADMIN:
            return UNAUTHORIZED()

        return customer_list_get()

    def resolve_customer_detail(self, info, user_id):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if user.role != UserRoleChoices.ADMIN:
            return UNAUTHORIZED()

        return customer_detail_get(user_id=user_id)

    def resolve_customers_paginated(self, info, page=1, limit=10, sort_by=None):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if user.role != UserRoleChoices.ADMIN:
            return UNAUTHORIZED()

        customers = customer_list_get(sort_by=sort_by)

        return get_paginator(customers, limit, page, TelegramUserPaginatedType)
