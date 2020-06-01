from django.http import JsonResponse
from django.shortcuts import render


# Create your views here.
def audio_upload(request):
    if request.method == "GET":
        return render(request, 'audio.html')
    return JsonResponse({"code": 1, "msg": "OK!"})
