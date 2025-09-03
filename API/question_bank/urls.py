from django.urls import path
from .views import GenerateQuestions,SubmitAnswers

urlpatterns = [
    path("uploadFile", GenerateQuestions.as_view(), name="generate-mcq"),
    path('submitAnswers', SubmitAnswers.as_view(), name='submit-answers'),
]
