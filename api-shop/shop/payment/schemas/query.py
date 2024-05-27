import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED
from payment.services.payment_services import payment_method_list

__all__ = [
    "Query"
]

from store.services import can_manage_store


class Query(graphene.ObjectType):
    payment_methods_list = graphene.List(
        "payment.schemas.schema.PaymentMethodType",
        store_id=graphene.UUID(required=True),
        state=graphene.String()
    )

    shop_payment_methods_list = graphene.List(
        "payment.schemas.schema.PaymentMethodSafeType",
        store_id=graphene.UUID(required=True),
        state=graphene.String()
    )

    def resolve_payment_methods_list(self, info, store_id, state=None, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        return payment_method_list(store_id=store_id, state=state)

    def resolve_shop_payment_methods_list(self, info, store_id, state=None, **kwargs):
        """
        This is a second resolver to payment method list.

        It is needed for the shop frontend, where we need to show only safe
        payment methods. By safe, we mean that we don't show any sensitive
        information about the payment method.
        """
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        return payment_method_list(store_id=store_id, state=state)
