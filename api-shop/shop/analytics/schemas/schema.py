import graphene
from graphene_django import DjangoObjectType

from analytics.models import Event

__all__ = [
    "EventType",
    "SalesAnalytics",
    "SessionAnalytics",
    "SessionByHour",
]


class EventType(DjangoObjectType):
    event_data = graphene.JSONString()
    state = graphene.String()
    store = graphene.Field("store.schemas.schema.StoreType")

    class Meta:
        model = Event
        fields = "__all__"


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


class SessionByHour(graphene.ObjectType):
    sessions = graphene.Int()
    hour = graphene.String()

    def resolve_sessions(self, info):
        return self.get("sessions")

    def resolve_hour(self, info):
        return self.get("hour")


class SessionAnalytics(graphene.ObjectType):
    session_count = graphene.Int()
    session_increase_percentage = graphene.Int()
    sessions = graphene.List(SessionByHour)

    def resolve_session_count(self, info):
        return self.get("session_count")

    def resolve_session_increase_percentage(self, info):
        return self.get("session_increase_percentage")

    def resolve_sessions(self, info):
        return self.get("sessions")

