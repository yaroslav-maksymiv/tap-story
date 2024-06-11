from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
import re


def validate_hex_color(value):
    if not re.match(r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', value):
        raise ValidationError('Enter a valid hex color code.')


image_extension_validator = FileExtensionValidator(['png', 'jpg'])
audio_extension_validator = FileExtensionValidator(['mp3', 'wav'])
video_extension_validator = FileExtensionValidator(['mp4'])
