from django.urls import path
from .views import CadastrosClientesListAPIView

urlpatterns = [
    path('clientes/', CadastrosClientesListAPIView.as_view(), name='clientes-list'),
]
