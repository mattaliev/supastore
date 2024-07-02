import graphene
from graphene_django import DjangoObjectType

from core.schemas import PaginatedType
from payment.models import Payment
from user.models import TelegramUser
from user.services import (
    customer_completed_payment_count,
    customer_is_new,
    customer_last_visit,
    customer_total_visit_count,
    customer_amount_spent,
    customer_added_to_cart_count,
    customer_total_cart_amount,
    customer_favorite_products
)

__all__ = [
    "TelegramUserType",
    "TelegramUserPaginatedType"
]


class TelegramUserType(DjangoObjectType):
    state = graphene.Field("core.schemas.EntityState")
    shipping_details = graphene.Field("shipping.schemas.ShippingDetailsType")
    orders = graphene.List("order.schemas.OrderType")
    carts = graphene.List("cart.schemas.CartType")
    payments = graphene.List("payment.schemas.PaymentType")
    events = graphene.List("analytics.schemas.EventType")
    has_default_shipping_details = graphene.Boolean()
    is_new = graphene.Boolean()
    last_visit = graphene.DateTime()
    order_count = graphene.Int()
    total_visit_count = graphene.Int()
    amount_spent = graphene.Decimal()
    cart_count = graphene.Int()
    added_to_cart_count = graphene.Int()
    total_cart_amount = graphene.Decimal()
    completed_payment_count = graphene.Int()
    favorite_products = graphene.List("product.schemas.ProductVariantType")

    def resolve_orders(self, info):
        return self.orders.all()

    def resolve_carts(self, info):
        return self.carts.all()

    def resolve_payments(self, info):
        return Payment.objects.filter(
            order__user=self,
        )

    def resolve_events(self, info):
        return self.events.all().order_by("-created")

    def resolve_state(self, info):
        return self.state

    def resolve_order_count(self, info):
        return self.orders.count()

    def resolve_completed_payment_count(self, info):
        return customer_completed_payment_count(user=self)

    def resolve_is_new(self, info):
        return customer_is_new(user=self)

    def resolve_last_visit(self, info):
        return customer_last_visit(user=self)

    def resolve_total_visit_count(self, info):
        return customer_total_visit_count(user=self)

    def resolve_amount_spent(self, info):
        return customer_amount_spent(user=self)

    def resolve_cart_count(self, info):
        return self.carts.count()

    def resolve_added_to_cart_count(self, info):
        return customer_added_to_cart_count(user=self)

    def resolve_total_cart_amount(self, info):
        return customer_total_cart_amount(user=self)

    def resolve_favorite_products(self, info):
        return customer_favorite_products(user=self)

    class Meta:
        model = TelegramUser
        fields = "__all__"


class StoreUserType(DjangoObjectType):
    user = graphene.Field("user.schemas.TelegramUserType")

    def resolve_user(self, info):
        return self.user

    class Meta:
        model = TelegramUser
        fields = "__all__"
        

class TelegramUserPaginatedType(PaginatedType):
    objects = graphene.List(TelegramUserType)

