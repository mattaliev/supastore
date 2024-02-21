from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from core.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True)))
]
