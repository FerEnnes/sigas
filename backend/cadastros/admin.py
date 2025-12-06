from django.contrib import admin
from .models import Notificacao

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display  = ("titulo", "tipo", "usuario", "lida", "created_at")
    list_filter   = ("tipo", "lida", "created_at")
    search_fields = ("titulo", "subtitulo", "usuario__username")
