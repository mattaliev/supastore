from uuid import UUID

from django.contrib.auth import get_user_model

from order.models import ShippingDetails, Order

__all__ = [
    "shipping_details_create",
    "shipping_details_update"
]

User = get_user_model()


def shipping_details_create(
    *,
    order_id: UUID,
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

    order = Order.objects.get(pk=order_id)
    order.shipping_details = shipping_details
    order.save()

    shipping_details.save()

    return shipping_details


def shipping_details_update(
    *,
    shipping_details_id: UUID,
    user_id: UUID = None,
    order_id: UUID,
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
    order = Order.objects.get(pk=order_id)

    if user.shipping_details == shipping_details and not is_default:
        shipping_details = shipping_details_create(
            user_id=user_id,
            order_id=order_id,
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
    order.save()

    return shipping_details
