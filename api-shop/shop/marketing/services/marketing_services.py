import logging
from typing import List
from uuid import UUID

from django.db.models import Q, Prefetch, QuerySet
from django.utils import timezone

from analytics.models import Event, EventTypeChoices
from core.exceptions import NotFoundError
from marketing.models import ManualMailing, ManualMailingAudienceChoices
from store.models import Store
from store.services import store_bot_token_get
from telegram.services import telegram_message_send
from telegram.services.shop.inline_buttons import MailingInlineButton
from user.models import TelegramUser, UserRoleChoices


def manual_mailing_list_get(*, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug("Getting manual mailings for store: %(store_id)s", {
        "store_id": store_id,
    })

    return ManualMailing.objects.filter(store_id=store_id)


def manual_mailing_get(*, mailing_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug("Getting manual mailing with id: %(mailing_id)s", {
        "mailing_id": mailing_id,
    })
    try:
        ManualMailing.objects.get(id=mailing_id)
    except ManualMailing.DoesNotExist as e:
        raise NotFoundError(str(e))


def manual_mailing_create(
        *,
        store_id: UUID,
        name: str,
        message: str,
        audience: List[ManualMailingAudienceChoices],
        cta_text: str,
        cta_url: str,
        execute_immediately: bool = False
):
    logger = logging.getLogger(__name__)
    logger.debug("Creating manual mailing for store: %(store_id)s", {
        "store_id": store_id,
    })

    mailing = ManualMailing.objects.create(
        store_id=store_id,
        name=name,
        message=message,
        audience=audience,
        cta_text=cta_text,
        cta_url=cta_url
    )

    if execute_immediately:
        manual_mailing_send(mailing_id=mailing.id)

    return mailing


# TODO: Update mailing logic
def manual_mailing_update(*, mailing_id: UUID):
    pass


def manual_mailing_send(*, mailing_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug("Sending manual mailing with id: %(mailing_id)s", {
        "mailing_id": mailing_id,
    })

    mailing = ManualMailing.objects.get(id=mailing_id)

    target_users = manual_mailing_audience_get(
        store_id=mailing.store_id,
        audiences=mailing.audience
    )

    user_count = target_users.count()
    successful_send_count = 0

    for user in target_users:
        success = manual_mailing_to_user_send(user=user, mailing=mailing)
        if success:
            successful_send_count += 1

    mailing.user_count = user_count
    mailing.successful_send_count = successful_send_count
    mailing.sent_at = timezone.now()
    mailing.save()

    return mailing


def manual_mailing_to_user_send(*, user: TelegramUser, mailing: ManualMailing):
    logger = logging.getLogger(__name__)
    logger.debug("Sending manual mailing to user: %(user_id)s", {
        "user_id": user.id,
    })

    bot_token = store_bot_token_get(store=mailing.store)

    reply_markup = None

    if mailing.cta_text and mailing.cta_url:
        reply_markup = [
            [MailingInlineButton(text=mailing.cta_text, url=mailing.cta_url).as_json()]
        ]

    try:
        telegram_message_send(
            bot_token=bot_token,
            chat_id=user.telegram_id,
            text=mailing.message,
            reply_markup=reply_markup,
            parse_mode=None
        )
        return True
    except Exception as e:
        logger.error("Error sending manual mailing to user: %(user_id)s. Error: %(error)s", {
            "user_id": user.id,
            "error": e
        })
        return False


def manual_mailing_preview(
        *,
        mailing_id: UUID = None,
        user_id: UUID = None,
        store_id: UUID = None,
        message: str,
        cta_text: str,
        cta_url: str,
        send_to_all_admins: bool = False
):
    logger = logging.getLogger(__name__)
    logger.debug("Previewing manual mailing with id: %(mailing_id)s", {
        "mailing_id": mailing_id,
    })
    store = Store.objects.get(id=store_id)
    bot_token = store_bot_token_get(store=store)

    if send_to_all_admins:
        admins = TelegramUser.objects.filter(
            Q(store_users__role=UserRoleChoices.ADMIN) |
            Q(store_users__role=UserRoleChoices.OWNER),
            store_users__store=store
        )
    else:
        admins = TelegramUser.objects.filter(id=user_id)

    reply_markup = None

    if cta_text and cta_url:
        reply_markup = [
            [MailingInlineButton(text=cta_text, url=cta_url).as_json()]
        ]

    try:
        for admin in admins:
            telegram_message_send(
                bot_token=bot_token,
                chat_id=admin.telegram_id,
                text=message,
                reply_markup=reply_markup,
                parse_mode=None
            )
        return True
    except Exception as e:
        logger.error("Error sending manual mailing to user: %(user_id)s. Error: %(error)s", {
            "user_id": store.store_users.first().telegram_id,
            "error": e
        })
        return False


def manual_mailing_audience_get(*, store_id: UUID, audiences: List[str]) -> QuerySet[TelegramUser]:
    """
    Get users who fit the target audience for manual mailing

    :param store_id: store id
    :param audiences: List of ManualMailingAudienceChoices
    :return: QuerySet[TelegramUser]
    """
    events_prefetch = Prefetch("events", queryset=Event.objects.filter(store_id=store_id))
    store_users = (
        TelegramUser.objects.filter(store_users__store_id=store_id)
            .prefetch_related(events_prefetch)
    )

    if ManualMailingAudienceChoices.ALL in audiences:
        return store_users

    queries = Q()

    if ManualMailingAudienceChoices.NEW in audiences:
        queries |= Q(
            events__event_type=EventTypeChoices.USER_REGISTERED
        ) & ~Q(
            events__event_type=EventTypeChoices.USER_VISITED
        )

    if ManualMailingAudienceChoices.ADDED_TO_CART in audiences:
        queries |= Q(events__event_type=EventTypeChoices.ADDED_TO_CART)

    if ManualMailingAudienceChoices.STARTED_CHECKOUT in audiences:
        queries |= Q(events__event_type=EventTypeChoices.CHECKOUT_STARTED)

    if ManualMailingAudienceChoices.PURCHASED in audiences:
        queries |= Q(events__event_type=EventTypeChoices.PAYMENT_COMPLETED)

    return store_users.filter(queries).distinct()

