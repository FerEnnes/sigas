from django.contrib.auth.models import User
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers

from .models import PerfilUsuario, Notificacao


class UsuarioSerializer(serializers.ModelSerializer):
    telefone    = serializers.CharField(source='perfil.telefone', allow_blank=True, required=False)
    cpf         = serializers.CharField(source='perfil.cpf')
    logradouro  = serializers.CharField(source='perfil.logradouro', allow_blank=True, required=False)
    numero      = serializers.CharField(source='perfil.numero', allow_blank=True, required=False)
    complemento = serializers.CharField(source='perfil.complemento', allow_blank=True, required=False)
    bairro      = serializers.CharField(source='perfil.bairro', allow_blank=True, required=False)
    cep         = serializers.CharField(source='perfil.cep', allow_blank=True, required=False)
    cidade      = serializers.CharField(source='perfil.cidade', allow_blank=True, required=False)
    estado      = serializers.CharField(source='perfil.estado', allow_blank=True, required=False)
    tipousuario = serializers.IntegerField(source='perfil.tipousuario')

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'telefone',
            'cpf',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
            'cep',
            'tipousuario',
            'is_active',
        ]
        read_only_fields = ['is_active']

    # ---------- validações ----------
    def validate_cpf(self, value):
        v = (value or '').strip()
        if not v:
            raise serializers.ValidationError('CPF é obrigatório.')
        if not v.isdigit() or len(v) != 11:
            raise serializers.ValidationError('CPF deve conter 11 dígitos numéricos.')
        return v

    def _verifica_cpf_unico(self, cpf, user_atual=None):
        qs = PerfilUsuario.objects.filter(cpf=cpf)
        if user_atual is not None:
            qs = qs.exclude(user=user_atual)
        if qs.exists():
            raise serializers.ValidationError({'cpf': 'Já existe um usuário com este CPF.'})

    # ---------- create ----------
    @transaction.atomic
    def create(self, validated_data):
        perfil_data = validated_data.pop('perfil')
        password = validated_data.pop('password', None)

        cpf = perfil_data.get('cpf')
        self._verifica_cpf_unico(cpf)

        estado = (perfil_data.get('estado') or '').strip().upper()[:2]
        perfil_data['estado'] = estado

        if not password:
            password = User.objects.make_random_password(length=8)

        user = User.objects.create(
            username   = validated_data['username'],
            first_name = validated_data.get('first_name', ''),
            last_name  = validated_data.get('last_name', ''),
            email      = validated_data.get('email', ''),
            is_active  = True,
        )
        user.set_password(password)

        tipo = perfil_data.get('tipousuario', 2)
        if int(tipo) == 1:  # Admin
            user.is_staff = True
            user.is_superuser = True
        else:               # Comum
            user.is_staff = False
            user.is_superuser = False
        user.save()

        PerfilUsuario.objects.update_or_create(
            user=user,
            defaults={
                'cpf'         : cpf,
                'telefone'    : perfil_data.get('telefone', ''),
                'logradouro'  : perfil_data.get('logradouro', ''),
                'numero'      : perfil_data.get('numero', ''),
                'complemento' : perfil_data.get('complemento', ''),
                'bairro'      : perfil_data.get('bairro', ''),
                'cidade'      : perfil_data.get('cidade', ''),
                'estado'      : perfil_data.get('estado', ''),
                'cep'         : perfil_data.get('cep', ''),
                'tipousuario' : perfil_data.get('tipousuario', 2),
            }
        )

        # envia e-mail com senha provisória (se tiver e-mail)
        if user.email:
            assunto = "[SIGAS] Acesso ao sistema"
            corpo = (
                f"Olá {user.first_name or user.username},\n\n"
                f"Seu usuário foi criado no SIGAS.\n\n"
                f"Login: {user.username}\n"
                f"Senha provisória: {password}\n\n"
                f"Recomenda-se alterar a senha no primeiro acesso.\n"
            )
            try:
                send_mail(
                    subject=assunto,
                    message=corpo,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception:
                pass

        return user

    # ---------- update ----------
    @transaction.atomic
    def update(self, instance, validated_data):
        perfil_data = validated_data.pop('perfil', {})
        password = validated_data.pop('password', None)

        for attr in ['username', 'first_name', 'last_name', 'email']:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        if password:
            instance.set_password(password)

        tipo = perfil_data.get('tipousuario', None)
        if tipo is not None:
            if int(tipo) == 1:  # Admin
                instance.is_staff = True
                instance.is_superuser = True
            else:
                instance.is_staff = False
                instance.is_superuser = False

        instance.save()

        # PerfilUsuario
        perfil, _ = PerfilUsuario.objects.get_or_create(user=instance)

        if 'estado' in perfil_data:
            estado = (perfil_data.get('estado') or '').strip().upper()[:2]
            perfil_data['estado'] = estado

        novo_cpf = perfil_data.get('cpf', perfil.cpf)
        if novo_cpf and novo_cpf != perfil.cpf:
            self._verifica_cpf_unico(novo_cpf, user_atual=instance)
            perfil.cpf = novo_cpf

        for field in [
            'telefone', 'logradouro', 'numero', 'complemento',
            'bairro', 'cidade', 'estado', 'cep', 'tipousuario'
        ]:
            if field in perfil_data:
                setattr(perfil, field, perfil_data[field])

        perfil.save()
        return instance

class NotificacaoSerializer(serializers.ModelSerializer):
    usuario = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Notificacao
        fields = [
            "id",
            "tipo",
            "titulo",
            "subtitulo",
            "lida",
            "created_at",
            "usuario",
        ]