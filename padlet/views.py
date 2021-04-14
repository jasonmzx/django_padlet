from django.shortcuts import render
from django.shortcuts import redirect
from .models import Padlet
import json
# Create your views here.
def index(request):
    return render(request, 'index.html', {})

def room(request, room_name):
    USERID = request.COOKIES.get('USERAUTH', None)
    PADLET_OBJ = Padlet.objects.get(pk="padlet_" + room_name)
    print(json.loads(PADLET_OBJ.allowed_users))
    #User is valid:
    if USERID in json.loads(PADLET_OBJ.allowed_users):



        return render(request, 'chatroom.html', {
            'room_name': room_name,
            'valid_users': json.loads(PADLET_OBJ.allowed_users),
            'client_user': USERID
        })

    #User isn't valid
    else:
        return redirect('index')