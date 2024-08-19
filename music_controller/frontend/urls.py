from .views import index
from django.urls import path
app_name = 'frontend'
urlpatterns = [
    
    path('',index, name=''),
    path('res',index),
    path('join',index,name='join'),
    path('create',index),
    path('room/<str:roomCode>',index,name='room')
]