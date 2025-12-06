"""
URL configuration for sigas_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for sigas_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from cadastros.views import (
    ClienteViewSet,
    FornecedorViewSet,
    PropriedadesViewSet,
    PlanoDeContasViewSet,
    APagarViewSet,
    AReceberViewSet,
    ContasResumoMensalView,
    EventoAgendaViewSet,
    EventoAgendaViewSet,
)
from usuarios.views import (
    UsuarioViewSet,
    LoginAPIView,
    NotificacaoViewSet,
    SolicitarRedefinicaoSenhaAPIView,
    RedefinirSenhaAPIView,
)

from usuarios.views import UsuarioViewSet, LoginAPIView, NotificacaoViewSet


router = DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='clientes')
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedores')
router.register(r'propriedades', PropriedadesViewSet, basename='propriedades')
router.register(r'plano-contas', PlanoDeContasViewSet, basename='plano-contas')
router.register(r'contas-pagar', APagarViewSet, basename='contas-pagar')
router.register(r'contas-receber', AReceberViewSet, basename='contas-receber')
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'notificacoes', NotificacaoViewSet, basename='notificacoes')
router.register(r'agenda-eventos', EventoAgendaViewSet, basename='agenda-eventos')

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/login/', LoginAPIView.as_view(), name='api-login'),

    path(
        'api/solicitar-redefinicao/',
        SolicitarRedefinicaoSenhaAPIView.as_view(),
        name='solicitar-redefinicao',
    ),
    path(
        'api/redefinir-senha/<str:uidb64>/<str:token>/',
        RedefinirSenhaAPIView.as_view(),
        name='redefinir-senha',
    ),

    # API REST
    path('api/', include(router.urls)),

    # endpoint extra de resumo
    path(
        'api/contas-resumo/<str:tipo>/',
        ContasResumoMensalView.as_view(),
        name='contas-resumo-mensal',
    ),
]
