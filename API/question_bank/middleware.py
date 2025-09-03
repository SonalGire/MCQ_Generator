# quizapp/middleware.py

from django.http import HttpResponseNotFound

class Log404Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code == 404:
            print("❌ 404 Error!")
            print("➡️ Path:", request.path)
            print("➡️ Method:", request.method)
            print("➡️ Headers:", dict(request.headers))
        return response
