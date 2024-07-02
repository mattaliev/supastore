import logging
from typing import List
from uuid import UUID

from core.exceptions import NotFoundError
from shipping.models import ShippingAddress, ContactInformation
from user.models import StoreUser

__all__ = [
    "shipping_address_list_get",
    "shipping_address_default_get",
    "shipping_address_create",
    "shipping_address_default_set",
    "shipping_address_delete",
    "contact_information_list_get",
    "contact_information_default_get",
    "contact_information_create",
    "contact_information_default_set",
    "contact_information_delete"
]


def shipping_address_list_get(*, user_id: UUID, store_id: UUID) -> List[ShippingAddress]:
    logger = logging.getLogger(__name__)
    logger.debug(
        "Listing shipping addresses for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    return ShippingAddress.objects.filter(store_user=store_user)


def shipping_address_default_get(*, user_id: UUID, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Getting default shipping address for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    return store_user.default_shipping_address


def shipping_address_create(*, user_id: UUID, store_id: UUID, address: str, additional_info: str):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Creating shipping address for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    shipping_address = ShippingAddress.objects.create(
        store_user=store_user,
        address=address,
        additional_info=additional_info
    )

    return shipping_address


def shipping_address_default_set(*, user_id: UUID, store_id: UUID, shipping_address_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Setting default shipping address for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    shipping_address = ShippingAddress.objects.filter(id=shipping_address_id).first()

    if shipping_address is None:
        raise NotFoundError("Shipping address not found")

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    store_user.default_shipping_address = shipping_address
    store_user.save()

    return shipping_address


def shipping_address_delete(*, user_id: UUID, shipping_address_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Deleting shipping address for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    shipping_address = ShippingAddress.objects.filter(id=shipping_address_id).first()

    if shipping_address is None:
        raise NotFoundError("Shipping address not found")

    shipping_address.delete()

    return True


def contact_information_list_get(*, user_id: UUID, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Listing contact information for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    return ContactInformation.objects.filter(store_user=store_user)


def contact_information_default_get(*, user_id: UUID, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Getting default contact information for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    return store_user.default_contact_info


def contact_information_create(*, user_id: UUID, store_id: UUID, name: str, phone: str, email: str):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Creating contact information for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    contact_information = ContactInformation.objects.create(
        store_user=store_user,
        phone=phone,
        name=name,
        email=email
    )

    return contact_information


def contact_information_default_set(*, user_id: UUID, store_id: UUID, contact_information_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Setting default contact information for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    contact_information = ContactInformation.objects.filter(id=contact_information_id).first()

    if contact_information is None:
        raise NotFoundError("Contact information not found")

    store_user = StoreUser.objects.filter(user_id=user_id, store_id=store_id).first()

    store_user.default_contact_info = contact_information
    store_user.save()

    return contact_information


def contact_information_delete(*, user_id: UUID, contact_information_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Deleting contact information for user: %(user_id)s", {
            "user_id": user_id
        }
    )

    contact_information = ContactInformation.objects.filter(id=contact_information_id).first()

    if contact_information is None:
        raise NotFoundError("Contact information not found")

    contact_information.delete()

    return True



