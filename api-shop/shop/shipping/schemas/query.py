import graphene

from core.exceptions import AuthenticationError
from shipping.services import (
    shipping_address_list_get,
    shipping_address_default_get,
    contact_information_list_get,
    contact_information_default_get
)

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    shipping_address_list_get = graphene.List("shipping.schemas.ShippingAddressType", store_id=graphene.UUID(required=True))
    shipping_address_default_get = graphene.Field("shipping.schemas.ShippingAddressType", store_id=graphene.UUID(required=True))
    contact_information_list_get = graphene.List("shipping.schemas.ContactInformationType", store_id=graphene.UUID(required=True))
    contact_information_default_get = graphene.Field("shipping.schemas.ContactInformationType", store_id=graphene.UUID(required=True))

    def resolve_shipping_address_list_get(self, info, store_id, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            raise AuthenticationError()

        shipping_address_list = shipping_address_list_get(store_id=store_id, user_id=user.id)
        return shipping_address_list

    def resolve_shipping_address_default_get(self, info, store_id, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            raise AuthenticationError()

        shipping_address = shipping_address_default_get(store_id=store_id, user_id=user.id)
        return shipping_address

    def resolve_contact_information_list_get(self, info, store_id, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            raise AuthenticationError()

        contact_information_list = contact_information_list_get(store_id=store_id, user_id=user.id)
        return contact_information_list

    def resolve_contact_information_default_get(self, info, store_id, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            raise AuthenticationError()

        contact_information = contact_information_default_get(store_id=store_id, user_id=user.id)
        return contact_information

