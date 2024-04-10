import logging
import graphene
from graphene_django import DjangoObjectType

from order.models.shipping_details import ShippingDetails
from order.services import shipping_details_create

__all__ = [
    "ShippingDetailsType",
    "ShippingDetailsCreateInput",
    "ShippingDetailsCreateMutation",
    "Mutation",
]

from order.services.shipping_details_services import shipping_details_update


class ShippingDetailsType(DjangoObjectType):
    class Meta:
        model = ShippingDetails
        fields = "__all__"


class ShippingDetailsInput(graphene.InputObjectType):
    user_id = graphene.UUID()
    is_default = graphene.Boolean(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    address = graphene.String(required=True)
    country = graphene.String(required=True)
    city = graphene.String()
    province = graphene.String()
    postcode = graphene.String(required=True)
    phone = graphene.String()
    email = graphene.String()


class ShippingDetailsCreateInput(ShippingDetailsInput):
    order_id = graphene.UUID(required=True)


class ShippingDetailsUpdateInput(ShippingDetailsInput):
    shipping_details_id = graphene.UUID(required=True)
    order_id = graphene.UUID(required=True)


class ShippingDetailsCreateMutation(graphene.Mutation):
    shipping_details = graphene.Field("order.schemas.ShippingDetailsType")

    class Arguments:
        input = ShippingDetailsCreateInput(required=True)

    def mutate(self, info, input, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Creating shipping details", {"order_id": input.order_id})
        shipping_details = shipping_details_create(**input)
        return ShippingDetailsCreateMutation(shipping_details=shipping_details)


class ShippingDetailsUpdateMutation(graphene.Mutation):
    shipping_details = graphene.Field("order.schemas.ShippingDetailsType")

    class Arguments:
        input = ShippingDetailsUpdateInput(required=True)

    def mutate(self, info, input, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Updating shipping details", {"shipping_details_id": input.shipping_details_id})
        shipping_details = shipping_details_update(**input)
        return ShippingDetailsUpdateMutation(shipping_details=shipping_details)


class Mutation(graphene.ObjectType):
    shipping_details_create = ShippingDetailsCreateMutation.Field()
    shipping_details_update = ShippingDetailsUpdateMutation.Field()
