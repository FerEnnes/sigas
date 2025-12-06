# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class APagar(models.Model):
    idcontapagar = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=30)
    valorparcela = models.DecimalField(max_digits=15, decimal_places=2)
    numeroparcela = models.IntegerField()
    datavencimento = models.DateField()
    dataquitacao = models.DateField(null=True, blank=True)
    valordesconto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valorjuros = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # relacionamentos – repara nas ASPAS
    idpropriedade = models.ForeignKey(
        'Propriedades',
        on_delete=models.PROTECT,
        db_column='idpropriedade',
        null=True,
        blank=True,
        related_name='contas_pagar',
    )
    idfornecedor = models.ForeignKey(
        'Fornecedores',
        on_delete=models.PROTECT,
        db_column='idfornecedor',
        null=True,
        blank=True,
        related_name='contas_pagar',
    )
    idplanocontas = models.ForeignKey(
        'PlanoDeContas',
        on_delete=models.PROTECT,
        db_column='idplanocontas',
        null=True,
        blank=True,
        related_name='contas_pagar',
    )

    class Meta:
        managed = False      
        db_table = 'a_pagar'

class AReceber(models.Model):
    idconta = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=30)
    valorparcela = models.DecimalField(max_digits=15, decimal_places=2)
    numeroparcela = models.IntegerField()
    datavencimento = models.DateField()
    dataquitacao = models.DateField(null=True, blank=True)
    valordesconto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valorjuros = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    idpropriedade = models.ForeignKey(
        'Propriedades',
        on_delete=models.PROTECT,
        db_column='idpropriedade',
        null=True,
        blank=True,
        related_name='contas_receber',
    )
    idcliente = models.ForeignKey(
        'Clientes',
        on_delete=models.PROTECT,
        db_column='idcliente',
        null=True,
        blank=True,
        related_name='contas_receber',
    )
    idplanocontas = models.ForeignKey(
        'PlanoDeContas',
        on_delete=models.PROTECT,
        db_column='idplanocontas',
        null=True,
        blank=True,
        related_name='contas_receber',
    )

    class Meta:
        managed = False
        db_table = 'a_receber'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    cpf = models.CharField(unique=True, max_length=14, blank=True, null=True)
    logradouro = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    complemento = models.CharField(max_length=255, blank=True, null=True)
    bairro = models.CharField(max_length=255, blank=True, null=True)
    cep = models.CharField(max_length=9, blank=True, null=True)
    cidade = models.CharField(max_length=255, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)
    tipousuario = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
    unique_together = (('usuario', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('usuario', 'permission'),)


class Clientes(models.Model):
    id = models.AutoField(primary_key=True, db_column='idcliente')
    nome = models.CharField(max_length=50)
    email = models.CharField(max_length=50, blank=True, null=True)
    cpf_cnpj = models.CharField(max_length=14, blank=True, null=True)
    rua = models.CharField(max_length=50, db_column='logradouro', blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)
    complemento = models.CharField(max_length=50, blank=True, null=True)
    bairro = models.CharField(max_length=30, blank=True, null=True)
    cep = models.CharField(max_length=8, blank=True, null=True)
    cidade = models.CharField(max_length=50, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientes'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Fornecedores(models.Model):
    idfornecedor = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50)
    cpf_cnpj = models.CharField(unique=True, max_length=14, blank=True, null=True)
    email = models.CharField(unique=True, max_length=50, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)  # NOVO
    logradouro = models.CharField(max_length=50, blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)
    complemento = models.CharField(max_length=50, blank=True, null=True)
    bairro = models.CharField(max_length=30, blank=True, null=True)
    cep = models.CharField(max_length=8, blank=True, null=True)
    cidade = models.CharField(max_length=30, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fornecedores'



class PlanoDeContas(models.Model):
    idplanocontas = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=50, blank=True, null=True)
    tipofluxocaixa = models.SmallIntegerField(blank=True, null=True)
    conta = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'plano_de_contas'


class Propriedades(models.Model):
    idpropriedade = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=30, blank=True, null=True)
    logradouro = models.CharField(max_length=50, blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)
    complemento = models.CharField(max_length=50, blank=True, null=True)
    bairro = models.CharField(max_length=30, blank=True, null=True)
    cep = models.CharField(max_length=8, blank=True, null=True)
    cidade = models.CharField(max_length=30, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)  # NOVO
    tipousuario = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'propriedades'



class UsuariosPropriedades(models.Model):
    idtiporelacaopropriedade = models.IntegerField(primary_key=True)
    idusuario = models.ForeignKey(AuthUser, models.DO_NOTHING, db_column='idusuario')
    idpropriedade = models.ForeignKey(Propriedades, models.DO_NOTHING, db_column='idpropriedade')

    class Meta:
        managed = False
        db_table = 'usuarios_propriedades'

class Notificacao(models.Model):
    TIPO_CHOICES = (
        ("conta_atrasada", "Conta em atraso"),
        ("conta_vencendo", "Conta vencendo"),
        ("sistema", "Atualização do sistema"),
    )

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notificacoes_cadastros",
    )

    tipo = models.CharField("Tipo", max_length=30, choices=TIPO_CHOICES)
    titulo = models.CharField("Título", max_length=120)
    subtitulo = models.CharField("Subtítulo", max_length=255, blank=True)

    lida = models.BooleanField("Lida", default=False)
    created_at = models.DateTimeField("Criada em", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"

    def __str__(self):
        return self.titulo

class EventoAgenda(models.Model):
    TIPO_CHOICES = (
        ('evento', 'Evento'),
        ('lembrete', 'Lembrete'),
        ('tarefa', 'Tarefa'),
        ('conta_pagar', 'Conta a pagar'),
        ('conta_receber', 'Conta a receber'),
    )

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='eventos_agenda'
    )
    titulo = models.CharField(max_length=200)
    inicio = models.DateTimeField()
    fim = models.DateTimeField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='evento')
    local = models.CharField(max_length=200, blank=True)
    participantes = models.TextField(blank=True)
    concluido = models.BooleanField(default=False)

    conta_pagar = models.ForeignKey('APagar', null=True, blank=True, on_delete=models.CASCADE)
    conta_receber = models.ForeignKey('AReceber', null=True, blank=True, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evento de agenda"
        verbose_name_plural = "Eventos de agenda"

    def __str__(self):
        return f'{self.titulo} ({self.inicio})'
    
from datetime import datetime, time
from django.utils import timezone


@receiver(post_save, sender=APagar)
def criar_evento_conta_pagar(sender, instance, created, **kwargs):
    """
    Sempre que salvar uma conta a pagar:
    - cria (ou atualiza) um evento na agenda na data de vencimento.
    """

    data_venc = instance.datavencimento      # nome real do campo
    descricao = instance.descricao or str(instance)

    if not data_venc:
        return

    # transforma Date em DateTime (ex.: 09h no fuso padrão)
    dt_inicio = datetime.combine(data_venc, time(hour=9, minute=0))
    dt_inicio = timezone.make_aware(dt_inicio, timezone.get_default_timezone())

    EventoAgenda.objects.update_or_create(
        conta_pagar=instance,
        defaults={
            'titulo': f'Conta a pagar: {descricao}',
            'inicio': dt_inicio,
            'fim': dt_inicio,
            'tipo': 'conta_pagar',
            'usuario': None,  # depois podemos amarrar ao dono da propriedade/usuário
            'local': '',
            'participantes': '',
            'concluido': bool(instance.dataquitacao),
        }
    )


@receiver(post_save, sender=AReceber)
def criar_evento_conta_receber(sender, instance, created, **kwargs):
    data_venc = instance.datavencimento      # nome real do campo
    descricao = instance.descricao or str(instance)

    if not data_venc:
        return

    dt_inicio = datetime.combine(data_venc, time(hour=9, minute=0))
    dt_inicio = timezone.make_aware(dt_inicio, timezone.get_default_timezone())

    EventoAgenda.objects.update_or_create(
        conta_receber=instance,
        defaults={
            'titulo': f'Conta a receber: {descricao}',
            'inicio': dt_inicio,
            'fim': dt_inicio,
            'tipo': 'conta_receber',
            'usuario': None,
            'local': '',
            'participantes': '',
            'concluido': bool(instance.dataquitacao),
        }
    )
