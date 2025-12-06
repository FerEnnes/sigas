from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def criar_perfil_usuario(sender, instance, created, **kwargs):
    """
    Signal mantido apenas por compatibilidade.

    A criação/atualização do PerfilUsuario é feita explicitamente
    no UsuarioSerializer (usuarios/serializers.py).

    Se a gente criasse um PerfilUsuario aqui, sem CPF, geraria
    conflito na constraint UNIQUE(cpf). Então não fazemos mais nada.
    """
    return
