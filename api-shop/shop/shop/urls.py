from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from core.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    path("payment/", include("payment.urls"), name="payment"),
    path("telegram/", include("telegram.urls"), name="telegram"),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True)))
]
