import graphene

from payment.services.payment_services import payment_create, \
    payment_method_create, payment_method_update, payment_method_delete, \
    payment_status_update
from .schema import PaymentCreateInput, PaymentMethodCreateInput, \
    PaymentMethodUpdateInput, PaymentStatusUpdate

__all__ = [
    "Mutation"
]


class PaymentMethodCreateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentMethodCreateInput(required=True)

    payment_method = graphene.Field("payment.schemas.schema.PaymentMethodType")

    @staticmethod
    def mutate(root, info, input):
        payment_method = payment_method_create(**input)
        return PaymentMethodCreateMutation(payment_method=payment_method)


class PaymentMethodUpdateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentMethodUpdateInput(required=True)

    payment_method = graphene.Field("payment.schemas.schema.PaymentMethodType")

    @staticmethod
    def mutate(root, info, input):
        payment_method = payment_method_update(**input)
        return PaymentMethodUpdateMutation(payment_method=payment_method)


class PaymentMethodDeleteMutation(graphene.Mutation):
    class Arguments:
        payment_method_id = graphene.UUID(required=True)

    success = graphene.Boolean()

    @staticmethod
    def mutate(root, info, payment_method_id):
        success = payment_method_delete(payment_method_id=payment_method_id)
        return PaymentMethodDeleteMutation(success=success)


class PaymentCreateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentCreateInput(required=True)

    provider = graphene.String()
    payment_info = graphene.JSONString()

    @staticmethod
    def mutate(root, info, input):
        provider, payment_info = payment_create(**input)
        return PaymentCreateMutation(
            provider=provider,
            payment_info=payment_info
        )


class PaymentStatusUpdateMutation(graphene.Mutation):
    class Arguments:
        input = PaymentStatusUpdate(required=True)

    success = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        payment_status_update(**input)
        return PaymentStatusUpdateMutation(success=True)


class Mutation(graphene.ObjectType):
    payment_create = PaymentCreateMutation.Field()
    payment_status_update = PaymentStatusUpdateMutation.Field()
    payment_method_create = PaymentMethodCreateMutation.Field()
    payment_method_update = PaymentMethodUpdateMutation.Field()
    payment_method_delete = PaymentMethodDeleteMutation.Field()
