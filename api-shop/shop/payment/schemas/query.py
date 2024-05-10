import graphene

from core.exceptions import UNAUTHENTICATED
from payment.services.payment_services import payment_method_list

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    payment_methods_list = graphene.List(
        "payment.schemas.schema.PaymentMethodType",
        state=graphene.String()
    )

    def resolve_payment_methods_list(self, info, state=None, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        return payment_method_list(state=state)
