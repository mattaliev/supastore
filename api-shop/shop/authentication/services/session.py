import logging
from uuid import UUID

from django.contrib.sessions.models import Session
from django.utils import timezone

__all__ = [
    'session_create',
    'session_update'
]


def session_create(*, user_id: UUID, store_id: UUID, hash: str):
    logger = logging.getLogger(__name__)
    logger.debug("Creating new session for user: %s", user_id)

    session = Session()
    session.session_key = hash[:40]
    session.expire_date = timezone.now() + timezone.timedelta(days=1)  # Session expires in 1 day
    session_data = {
        'hash': hash,
        'created': str(timezone.now()),
        'updated': str(timezone.now()),
        'user_id': str(user_id),
        'store_id': str(store_id),
    }
    session_data_str = Session.objects.encode(session_data)
    session.session_data = session_data_str

    # Save the session object
    session.save()

    return session


def session_update(*, session: Session):
    logger = logging.getLogger(__name__)
    try:
        decoded_session = session.get_decoded()
        decoded_session['updated'] = str(timezone.now())
        session.session_data = Session.objects.encode(decoded_session)
        session.save()
        return session
    except Exception as e:
        logger.warning("Session update failed: %s", e)
        return None