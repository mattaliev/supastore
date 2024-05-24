import graphene

from core.exceptions import UNAUTHENTICATED
from payment.services.payment_services import payment_method_list

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    payment_methods_list = graphene.List(
        "payment.schemas.schema.PaymentMethodType",
        store_id=graphene.UUID(required=True),
        state=graphene.String()
    )

    def resolve_payment_methods_list(self, info, store_id, state=None, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        return payment_method_list(store_id=store_id, state=state)
