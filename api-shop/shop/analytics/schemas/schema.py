import graphene

__all__ = [
    "SalesAnalytics",
]


class SalesAnalytics(graphene.ObjectType):
    sales_this_week = graphene.Decimal()
    sales_this_month = graphene.Decimal()
    sales_increase_this_week = graphene.Decimal()
    sales_increase_this_month = graphene.Decimal()

    def resolve_sales_this_week(self, info):
        return self.get("sales_this_week")

    def resolve_sales_this_month(self, info):
        return self.get("sales_this_month")

    def resolve_sales_increase_this_week(self, info):
        return self.get("sales_increase_this_week")

    def resolve_sales_increase_this_month(self, info):
        return self.get("sales_increase_this_month")
