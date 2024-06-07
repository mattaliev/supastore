import logging
from datetime import datetime, timedelta
from uuid import UUID

import pytz
from django.db.models import Count
from django.db.models.functions import ExtractHour
from django.utils.timezone import make_aware

from store.services.store_services import store_timezone_get
from user.models.user import UserSession

__all__ = [
    "session_analytics_by_hour_get",
]


def session_increase_percentage_calculate(*, session_count: int, session_count_previous_day: int):
    if session_count_previous_day == 0 and session_count == 0:
        return 0

    if session_count_previous_day == 0:
        return 100

    return ((session_count - session_count_previous_day) / session_count_previous_day) * 100


def session_analytics_by_hour_get(store_id: UUID, date_str: str | None):
    logger = logging.getLogger(__name__)
    logger.debug("Getting session analytics for store: %(store_id)s on date: %(date_str)s", {
        "store_id": store_id,
        "date_str": date_str,
    })

    # Parse the date and timezone
    if date_str is None:
        date = datetime.now()
    else:
        date = datetime.strptime(date_str, "%Y-%m-%d")

    timezone_str = store_timezone_get(store_id=store_id)
    timezone = pytz.timezone(timezone_str)

    # Calculate the start and end of the day in the specified timezone
    start_of_day = make_aware(
        datetime(date.year, date.month, date.day, 0, 0, 0), timezone
    )

    is_today = date.date() == datetime.now().date()
    if is_today:
        end_of_day = datetime.now(timezone)
    else:
        end_of_day = start_of_day + timedelta(days=1)

    # Query UserSessions grouped by hour
    sessions = UserSession.objects.filter(
        store_id=store_id,
        created__range=(start_of_day, end_of_day)
    )

    sessions_previous_day = UserSession.objects.filter(
        store_id=store_id,
        created__range=(
            start_of_day - timedelta(days=1),
            end_of_day - timedelta(days=1)
        )
    )

    session_count = sessions.count()
    session_increase_percentage = session_increase_percentage_calculate(
        session_count=session_count,
        session_count_previous_day=sessions_previous_day.count()
    )

    sessions = (
        sessions.annotate(hour=ExtractHour('created', tzinfo=timezone))
        .values('hour')
        .annotate(sessions=Count('id'))
        .order_by('hour')
    )

    end_hour = end_of_day.hour if is_today else 23

    # Create a dictionary of sessions by hour
    sessions_dict = {
        session['hour']: session['sessions'] for session in sessions
    }

    # Prepare the data with all relevant hours
    data = [
        {
            "sessions": sessions_dict.get(hour, 0),
            "hour": (start_of_day + timedelta(hours=hour)).strftime("%I%p")
        }
        for hour in range(end_hour + 1)
    ]

    return {
        "sessions": data,
        "session_count": int(session_count),
        "session_increase_percentage": int(session_increase_percentage)
    }


