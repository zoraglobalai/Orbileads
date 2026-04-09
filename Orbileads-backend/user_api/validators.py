import re

from django.core.exceptions import ValidationError


FULL_NAME_REGEX = re.compile(r"^[A-Za-z]+(?:[A-Za-z\s'.-]{0,148}[A-Za-z.])?$")
COUNTRY_REGEX = re.compile(r"^[A-Za-z]+(?:[A-Za-z\s'.-]{0,98}[A-Za-z])?$")
COMPANY_REGEX = re.compile(r"^[A-Za-z0-9]+(?:[A-Za-z0-9\s&'.,-]{0,148}[A-Za-z0-9.])?$")


def normalize_whitespace(value):
    return ' '.join((value or '').strip().split())


def normalize_full_name(value):
    value = normalize_whitespace(value)
    if value:
        value = value.title()
    return value


def validate_full_name(value):
    value = normalize_full_name(value)
    if len(value) < 2 or not FULL_NAME_REGEX.match(value):
        raise ValidationError('Enter a valid full name.')
    return value


def normalize_country(value):
    value = normalize_whitespace(value)
    if value:
        value = value.title()
    return value


def validate_country(value):
    value = normalize_country(value)
    if len(value) < 2 or not COUNTRY_REGEX.match(value):
        raise ValidationError('Enter a valid country name.')
    return value


def normalize_company_name(value):
    return normalize_whitespace(value)


def validate_company_name(value):
    value = normalize_company_name(value)
    if value and (len(value) < 2 or not COMPANY_REGEX.match(value)):
        raise ValidationError('Enter a valid company name.')
    return value


def normalize_mobile_number(value):
    raw = (value or '').strip()
    raw = raw.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    if raw.startswith('+'):
        digits = '+' + re.sub(r'\D', '', raw)
    else:
        digits = re.sub(r'\D', '', raw)
    return digits


def validate_mobile_number(value):
    value = normalize_mobile_number(value)
    digits_only = value[1:] if value.startswith('+') else value
    if not digits_only.isdigit() or not 8 <= len(digits_only) <= 15:
        raise ValidationError('Enter a valid mobile number.')
    return value if value.startswith('+') else f'+{digits_only}'
