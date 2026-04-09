from rest_framework import status
from rest_framework.response import Response


def build_response(*, success, message, data=None, errors=None, status_code=status.HTTP_200_OK):
    payload = {
        'success': success,
        'message': message,
    }
    if data is not None:
        payload['data'] = data
    if errors is not None:
        payload['errors'] = errors
    return Response(payload, status=status_code)
