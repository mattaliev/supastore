from django.contrib.auth import get_user_model

from analytics.models import UserVisit

User = get_user_model()

__all__ = [
    "user_visit_register",
]


def user_visit_register(*, user: User) -> None:
    visit = UserVisit.objects.create()

    if not user.is_anonymous:
        visit.user = user
        visit.save()
