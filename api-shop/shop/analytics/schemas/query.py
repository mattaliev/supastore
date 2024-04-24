import graphene

from analytics.services import sales_analytics_get
from .schema import SalesAnalytics


class Query(graphene.ObjectType):
    sales_analytics_get = graphene.Field(SalesAnalytics)

    def resolve_sales_analytics_get(self, info):
        sales_analytics = sales_analytics_get()
        return sales_analytics
