from django.shortcuts import render
from django.shortcuts import redirect
from .models import Padlet, profile
import json
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
# Create your views here.

def home(request):
    return render(request, 'homepage.html', {})

def index(request):
    if request.user.is_authenticated:
        try:
            #Intially grabbing the Authenticated User's profile:
            PROFILE_OBJ = profile.objects.get(pk=request.user.username)


        #If this user doesn't have a registered profile yet, register one using the profile Model.
        except:
            (profile(profile_owner=request.user.username)).save()



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


def mypadlets(request):
    return render(request, 'index.html', {})