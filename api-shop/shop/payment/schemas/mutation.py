import graphene

from core.exceptions import UNAUTHORIZED, UNAUTHENTICATED
from order.models import Order
from payment.services.payment_services import (
    payment_create,
    payment_method_create,
    payment_method_update,
    payment_method_delete,
    payment_status_update
)
from store.services import can_manage_store
from .schema import (
    PaymentCreateInput,
    PaymentMethodCreateInput,
    PaymentMethodUpdateInput,
    PaymentStatusUpdateInput
)

__all__ = [
    "Mutation"
]


class PaymentMethodCreateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentMethodCreateInput(required=True)

    payment_method = graphene.Field("payment.schemas.schema.PaymentMethodType")

    @staticmethod
    def mutate(root, info, input):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=input.store_id):
            raise UNAUTHORIZED()

        payment_method = payment_method_create(**input)
        return PaymentMethodCreateMutation(payment_method=payment_method)


class PaymentMethodUpdateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentMethodUpdateInput(required=True)

    payment_method = graphene.Field("payment.schemas.schema.PaymentMethodType")

    @staticmethod
    def mutate(root, info, input):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        store_id = input.pop("store_id")

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        payment_method = payment_method_update(**input)
        return PaymentMethodUpdateMutation(payment_method=payment_method)


class PaymentMethodDeleteMutation(graphene.Mutation):
    class Arguments:
        store_id = graphene.UUID(required=True)
        payment_method_id = graphene.UUID(required=True)

    success = graphene.Boolean()

    @staticmethod
    def mutate(root, info, store_id, payment_method_id):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        success = payment_method_delete(payment_method_id=payment_method_id)
        return PaymentMethodDeleteMutation(success=success)


class PaymentCreateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentCreateInput(required=True)

    provider = graphene.String()
    payment_info = graphene.JSONString()

    @staticmethod
    def mutate(root, info, input):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        order = Order.objects.get(id=input.get("order_id"))
        if not user.can_access_resource(order) and not can_manage_store(user=user, store_id=order.store_id):
            raise UNAUTHORIZED()

        provider, payment_info = payment_create(**input)
        return PaymentCreateMutation(
            provider=provider,
            payment_info=payment_info
        )


class PaymentStatusUpdateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentStatusUpdateInput(required=True)

    success = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        store_id = input.pop("store_id")

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        payment_status_update(**input)
        return PaymentStatusUpdateMutation(success=True)


class Mutation(graphene.ObjectType):
    payment_create = PaymentCreateMutation.Field()
    payment_status_update = PaymentStatusUpdateMutation.Field()
    payment_method_create = PaymentMethodCreateMutation.Field()
    payment_method_update = PaymentMethodUpdateMutation.Field()
    payment_method_delete = PaymentMethodDeleteMutation.Field()
