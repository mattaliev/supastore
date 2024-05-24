import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED
from shipping.schemas import ShippingDetailsCreateInput, \
    ShippingDetailsUpdateInput, ShippingAddTrackingInput
from shipping.services import shipping_details_create, shipping_details_update, \
    shipping_add_tracking

__all__ = [
    "ShippingDetailsCreateMutation",
    "ShippingDetailsUpdateMutation",
    "Mutation"
]

from store.services import can_manage_store


class ShippingAddTrackingMutation(graphene.Mutation):
    shipping = graphene.Field("shipping.schemas.ShippingType")

    class Arguments:
        input = ShippingAddTrackingInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=input.store_id):
            raise UNAUTHORIZED()

        shipping = shipping_add_tracking(**input)
        return ShippingAddTrackingMutation(shipping=shipping)


class ShippingDetailsCreateMutation(graphene.Mutation):
    shipping_details = graphene.Field("shipping.schemas.ShippingDetailsType")

    class Arguments:
        input = ShippingDetailsCreateInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        shipping_details = shipping_details_create(**input, user_id=user.id)
        return ShippingDetailsCreateMutation(shipping_details=shipping_details)


class ShippingDetailsUpdateMutation(graphene.Mutation):
    shipping_details = graphene.Field("shipping.schemas.ShippingDetailsType")

    class Arguments:
        input = ShippingDetailsUpdateInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()
        
        shipping_details = shipping_details_update(**input, user_id=user.id)
        return ShippingDetailsUpdateMutation(shipping_details=shipping_details)


class Mutation(graphene.ObjectType):
    shipping_add_tracking = ShippingAddTrackingMutation.Field()
    shipping_details_create = ShippingDetailsCreateMutation.Field()
    shipping_details_update = ShippingDetailsUpdateMutation.Field()
