import logging

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def _serialize_errors(detail):
    if isinstance(detail, list):
        return [_serialize_errors(item) for item in detail]
    if isinstance(detail, dict):
        return {key: _serialize_errors(value) for key, value in detail.items()}
    if isinstance(detail, ErrorDetail):
        return str(detail)
    return detail


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        message = 'Request could not be processed.'
        if isinstance(response.data, dict) and response.data.get('detail'):
            message = str(response.data['detail'])

        return Response(
            {
                'success': False,
                'message': message,
                'errors': _serialize_errors(response.data),
            },
            status=response.status_code,
        )

    if isinstance(exc, DjangoValidationError):
        return Response(
            {
                'success': False,
                'message': 'Validation failed.',
                'errors': _serialize_errors(getattr(exc, 'message_dict', exc.messages)),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    logger.exception('Unhandled API error', exc_info=exc)
    return Response(
        {
            'success': False,
            'message': 'An unexpected error occurred.',
            'errors': {'detail': 'Please try again later.'},
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
