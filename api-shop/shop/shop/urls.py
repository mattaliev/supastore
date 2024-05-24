from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView

from core.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    path("payment/", include("payment.urls"), name="payment"),
    path("telegram/", include("telegram.urls"), name="telegram"),
    path('graphql/', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True)))
]
