from django.urls import path
from . import views

# Padlet URLS Are specifically for the padlet application
urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
]