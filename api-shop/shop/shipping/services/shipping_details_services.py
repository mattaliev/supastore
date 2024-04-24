import logging
from uuid import UUID

from django.contrib.auth import get_user_model

from order.models import ShippingDetails, FulfillmentStatusChoices
from shipping.models import Shipping

__all__ = [
    "shipping_add_tracking",
    "shipping_details_create",
    "shipping_details_update"
]

User = get_user_model()


def shipping_add_tracking(*, shipping_id: UUID, carrier: str,
                          tracking_number: str) -> Shipping:
    logger = logging.getLogger(__name__)
    logger.debug(
        "Adding tracking to shipping: %(shipping_id)s",
        {"shipping_id": shipping_id}
    )
    shipping = Shipping.objects.get(pk=shipping_id)
    shipping.carrier = carrier
    shipping.tracking_number = tracking_number
    shipping.order.fulfilment_status = FulfillmentStatusChoices.TRACKING
    shipping.save()
    shipping.order.save()

    return shipping


def shipping_details_create(
        *,
        shipping_id: UUID,
        user_id: UUID = None,
        first_name: str,
        last_name: str,
        address: str,
        country: str,
        city: str = None,
        province: str = None,
        postcode: str,
        phone: str = None,
        email: str = None,
        is_default: bool = False
) -> ShippingDetails:
    shipping_details = ShippingDetails.objects.create(
        first_name=first_name,
        last_name=last_name,
        address=address,
        country=country,
        city=city,
        province=province,
        postcode=postcode,
        phone=phone,
        email=email,
    )

    if is_default and user_id:
        user = User.objects.get(pk=user_id)
        user.shipping_details = shipping_details
        user.save()

    shipping = Shipping.objects.get(pk=shipping_id)
    shipping.details = shipping_details
    shipping.save()

    shipping_details.save()

    return shipping_details


def shipping_details_update(
        *,
        shipping_details_id: UUID,
        user_id: UUID = None,
        shipping_id: UUID,
        first_name: str,
        last_name: str,
        address: str,
        country: str,
        city: str = None,
        province: str = None,
        postcode: str,
        phone: str = None,
        email: str = None,
        is_default: bool = False
) -> ShippingDetails:
    shipping_details = ShippingDetails.objects.get(pk=shipping_details_id)
    user = User.objects.get(pk=user_id)
    shipping = Shipping.objects.get(pk=shipping_id)

    if user.shipping_details == shipping_details and not is_default:
        shipping_details = shipping_details_create(
            user_id=user_id,
            shipping_id=shipping_id,
            first_name=first_name,
            last_name=last_name,
            address=address,
            country=country,
            city=city,
            province=province,
            postcode=postcode,
            phone=phone,
            email=email,
            is_default=is_default
        )
        return shipping_details

    shipping_details.first_name = first_name
    shipping_details.last_name = last_name
    shipping_details.address = address
    shipping_details.country = country
    shipping_details.city = city
    shipping_details.province = province
    shipping_details.postcode = postcode
    shipping_details.phone = phone
    shipping_details.email = email

    if is_default and user_id:
        user = User.objects.get(pk=user_id)
        user.shipping_details = shipping_details
        user.save()

    shipping_details.save()
    shipping.save()

    return shipping_details
