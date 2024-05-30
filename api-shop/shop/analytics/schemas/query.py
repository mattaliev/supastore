import graphene

from analytics.services import (
    sales_analytics_get,
    session_analytics_by_hour_get
)
from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED
from store.services import can_manage_store
from .schema import SalesAnalytics, SessionAnalytics


class Query(graphene.ObjectType):
    sales_analytics_get = graphene.Field(SalesAnalytics, store_id=graphene.UUID(required=True))
    session_analytics_by_hour_get = graphene.Field(SessionAnalytics, store_id=graphene.UUID(required=True), date=graphene.String())

    def resolve_sales_analytics_get(self, info, store_id, **kwargs):
        sales_analytics = sales_analytics_get(store_id=store_id)
        return sales_analytics

    def resolve_session_analytics_by_hour_get(self, info, store_id, date=None, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        session_analytics = session_analytics_by_hour_get(
            store_id=store_id,
            date_str=date,
        )

        return session_analytics
