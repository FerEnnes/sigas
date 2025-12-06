from django.db import models
from django.contrib.auth.models import User


class PerfilUsuario(models.Model):
    TIPO_USUARIO_CHOICES = (
        (1, 'Admin'),
        (2, 'Comum'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='perfil'
    )

    telefone = models.CharField('Telefone', max_length=20, blank=True)
    cpf = models.CharField('CPF', max_length=11, unique=True)

    logradouro = models.CharField('Logradouro', max_length=50, blank=True)
    numero = models.CharField('Número', max_length=10, blank=True)
    complemento = models.CharField('Complemento', max_length=50, blank=True)
    bairro = models.CharField('Bairro', max_length=30, blank=True)
    cep = models.CharField('CEP', max_length=8, blank=True)
    cidade = models.CharField('Cidade', max_length=30, blank=True)
    estado = models.CharField('Estado', max_length=2, blank=True)

    tipousuario = models.PositiveSmallIntegerField(
        'Tipo de usuário',
        choices=TIPO_USUARIO_CHOICES,
        default=2,
    )

    def __str__(self):
        return f'{self.user.username} ({self.cpf})'


class Notificacao(models.Model):
    TIPO_CHOICES = (
        ("conta_atrasada", "Conta a pagar em atraso"),
        ("conta_vence_hoje", "Conta que vence hoje"),
        ("atualizacao_sistema", "Atualização do sistema"),
        ("outro", "Outro"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notificacoes",
        verbose_name="Usuário",
    )
    tipo = models.CharField("Tipo", max_length=50, choices=TIPO_CHOICES)
    titulo = models.CharField("Título", max_length=200)
    subtitulo = models.CharField("Subtítulo", max_length=300, blank=True)
    lida = models.BooleanField("Lida", default=False)
    created_at = models.DateTimeField("Criada em", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.titulo