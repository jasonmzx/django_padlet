from django.urls import path
from . import views

# Padlet regURLS (Regular URLS) are for regular website functionalities (Loging in, About us, etc..)
urlpatterns = [
    path('', views.home, name='home'),
    path('mypadlets',views.mypadlets,name='mypadlets'),
    path('createpadlet',views.createpadlet,name='createpadlet'),
    #AJAX METHODS
    path('search_user_method',views.search_user_method,name='search_user_method'),
]