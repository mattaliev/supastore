import graphene

from analytics.services import sales_analytics_get
from .schema import SalesAnalytics


class Query(graphene.ObjectType):
    sales_analytics_get = graphene.Field(SalesAnalytics, store_id=graphene.UUID(required=True))

    def resolve_sales_analytics_get(self, info, store_id, **kwargs):
        sales_analytics = sales_analytics_get(store_id=store_id)
        return sales_analytics
