import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED, AuthenticationError
from shipping.services import (
    shipping_details_create,
    shipping_details_update,
    shipping_add_tracking,
    shipping_address_create,
    shipping_address_default_set,
    contact_information_create,
    contact_information_default_set,
    contact_information_delete,
    shipping_address_delete
)
from store.services import can_manage_store
from .schema import (
    ShippingDetailsCreateInput,
    ShippingDetailsUpdateInput,
    ShippingAddTrackingInput,
    ShippingAddressCreateInput,
    ContactInformationCreateInput
)

__all__ = [
    "ShippingDetailsCreateMutation",
    "ShippingDetailsUpdateMutation",
    "Mutation"
]


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


class ShippingAddressCreateMutation(graphene.Mutation):
    shipping_address = graphene.Field("shipping.schemas.ShippingAddressType")

    class Arguments:
        input = ShippingAddressCreateInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        shipping_address = shipping_address_create(**input, user_id=user.id)
        return ShippingAddressCreateMutation(shipping_address=shipping_address)


class ShippingAddressDefaultSetMutation(graphene.Mutation):
    shipping_address = graphene.Field("shipping.schemas.ShippingAddressType")

    class Arguments:
        store_id = graphene.UUID(required=True)
        shipping_address_id = graphene.UUID(required=True)

    def mutate(self, info, store_id, shipping_address_id,  **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        shipping_address = shipping_address_default_set(
            user_id=user.id,
            store_id=store_id,
            shipping_address_id=shipping_address_id
        )
        return ShippingAddressDefaultSetMutation(shipping_address=shipping_address)


class ShippingAddressDeleteMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        shipping_address_id = graphene.UUID(required=True)

    def mutate(self, info, shipping_address_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        shipping_address_delete(user_id=user.id, shipping_address_id=shipping_address_id)
        return ShippingAddressDeleteMutation(success=True)



class ContactInformationCreateMutation(graphene.Mutation):
    contact_information = graphene.Field("shipping.schemas.ContactInformationType")

    class Arguments:
        input = ContactInformationCreateInput()

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        contact_information = contact_information_create(user_id=user.id, **input)

        return ContactInformationCreateMutation(contact_information=contact_information)


class ContactInformationDefaultSetMutation(graphene.Mutation):
    contact_information = graphene.Field("shipping.schemas.ContactInformationType")

    class Arguments:
        store_id = graphene.UUID(required=True)
        contact_information_id = graphene.UUID(required=True)

    def mutate(self, info, store_id, contact_information_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        contact_information = contact_information_default_set(
            user_id=user.id,
            store_id=store_id,
            contact_information_id=contact_information_id
        )

        return ContactInformationDefaultSetMutation(contact_information=contact_information)


class ContactInformationDeleteMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        contact_information_id = graphene.UUID(required=True)

    def mutate(self, info, contact_information_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        contact_information_delete(user_id=user.id, contact_information_id=contact_information_id)

        return ContactInformationDeleteMutation(success=True)


class Mutation(graphene.ObjectType):
    shipping_add_tracking = ShippingAddTrackingMutation.Field()
    shipping_details_create = ShippingDetailsCreateMutation.Field()
    shipping_details_update = ShippingDetailsUpdateMutation.Field()
    shipping_address_create = ShippingAddressCreateMutation.Field()
    shipping_address_default_set = ShippingAddressDefaultSetMutation.Field()
    shipping_address_delete = ShippingAddressDeleteMutation.Field()
    contact_information_create = ContactInformationCreateMutation.Field()
    contact_information_default_set = ContactInformationDefaultSetMutation.Field()
    contact_information_delete = ContactInformationDeleteMutation.Field()
