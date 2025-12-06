from django.contrib import admin
from .models import PerfilUsuario, Notificacao


@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ("user", "cpf", "telefone", "tipousuario")
    search_fields = ("user__username", "cpf")


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ("titulo", "tipo", "user", "lida", "created_at")
    list_filter = ("tipo", "lida", "created_at")
    search_fields = ("titulo", "subtitulo", "user__username")
