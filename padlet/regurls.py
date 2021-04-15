from django.urls import path
from . import views

# Padlet regURLS (Regular URLS) are for regular website functionalities (Loging in, About us, etc..)
urlpatterns = [
    path('', views.home, name='home'),
]