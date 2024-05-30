import logging
from uuid import UUID

from django.utils import timezone

__all__ = [
    'session_create',
    'session_update'
]

from user.models.user import UserSession


def session_create(*, user_id: UUID, store_id: UUID, hash: str):
    logger = logging.getLogger(__name__)
    logger.debug("Creating new session for user: %s", user_id)

    session = UserSession.objects.create(
        user_id=user_id, store_id=store_id, hash=hash
    )

    return session


def session_update(*, hash: str):
    logger = logging.getLogger(__name__)
    try:
        session = UserSession.objects.get(hash=hash)
        session.updated = timezone.now()
        session.save()
        return session
    except Exception as e:
        logger.warning("Session update failed: %s", e)
        return None