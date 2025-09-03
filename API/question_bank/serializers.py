from rest_framework import serializers
from .models import UserQuizAnswer

class UploadFileSerializer(serializers.Serializer):
    file = serializers.FileField()


class UserQuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuizAnswer
        fields = '__all__'
