import graphene
from graphene_django import DjangoObjectType

from shipping.models import (
    Shipping,
    ShippingDetails,
    ShippingAddress,
    ContactInformation
)

__all__ = [
    "ShippingType",
    "ShippingDetailsType",
    "ShippingAddTrackingInput",
    "ShippingDetailsInput",
    "ShippingDetailsCreateInput",
    "ShippingDetailsUpdateInput",
    "ShippingAddressType",
    "ShippingAddressCreateInput",
    "ContactInformationType",
    "ContactInformationCreateInput"
]


class ShippingType(DjangoObjectType):
    contact_info = graphene.Field("shipping.schemas.ContactInformationType")
    shipping_address = graphene.Field("shipping.schemas.ShippingAddressType")

    class Meta:
        model = Shipping
        fields = "__all__"


class ShippingDetailsType(DjangoObjectType):
    class Meta:
        model = ShippingDetails
        fields = "__all__"


class ShippingAddTrackingInput(graphene.InputObjectType):
    store_id = graphene.UUID(required=True)
    shipping_id = graphene.UUID(required=True)
    carrier = graphene.String(required=True)
    tracking_number = graphene.String(required=True)


class ShippingDetailsInput(graphene.InputObjectType):
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
    shipping_id = graphene.UUID(required=True)


class ShippingDetailsUpdateInput(ShippingDetailsInput):
    shipping_details_id = graphene.UUID(required=True)
    shipping_id = graphene.UUID(required=True)


class ShippingAddressType(DjangoObjectType):
    class Meta:
        model = ShippingAddress
        fields = "__all__"


class ShippingAddressCreateInput(graphene.InputObjectType):
    store_id = graphene.UUID(required=True)
    address = graphene.String(required=True)
    additional_info = graphene.String()


class ContactInformationType(DjangoObjectType):
    class Meta:
        model = ContactInformation
        fields = "__all__"


class ContactInformationCreateInput(graphene.InputObjectType):
    store_id = graphene.UUID(required=True)
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String(required=True)
