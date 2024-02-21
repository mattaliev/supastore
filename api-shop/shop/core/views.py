from django.http import JsonResponse


def index(request):
    """
    View to process index request

    returns json response "Success"

    """
    return JsonResponse({"status": "Success"})
