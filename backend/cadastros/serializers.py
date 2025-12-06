from rest_framework import serializers
from .models import Clientes, Fornecedores, Propriedades, PlanoDeContas, APagar, AReceber
from .models import Notificacao
from .models import EventoAgenda



class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = [
            'id',
            'nome',
            'email',
            'cpf_cnpj',
            'telefone',
            'cep',
            'rua',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
        ]


class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedores
        fields = [
            'idfornecedor',
            'nome',
            'cpf_cnpj',
            'email',
            'telefone',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cep',
            'cidade',
            'estado',
        ]


class PropriedadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propriedades
        fields = [
            'idpropriedade',
            'descricao',
            'telefone',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cep',
            'cidade',
            'estado',
        ]


class PlanoDeContasSerializer(serializers.ModelSerializer):
    """
    Usa diretamente as colunas da tabela plano_de_contas:
    - idplanocontas (PK)
    - conta         (código: 1, 1.1, 1.1.1.1...)
    - descricao
    - tipofluxocaixa (vamos usar 1 = Débito, 2 = Crédito)
    """

    class Meta:
        model = PlanoDeContas
        fields = [
            'idplanocontas',
            'conta',
            'descricao',
            'tipofluxocaixa',
        ]

    def validate_conta(self, value):
        if not value:
            raise serializers.ValidationError("O código da conta é obrigatório.")
        return value

class APagarSerializer(serializers.ModelSerializer):
    class Meta:
        model = APagar
        fields = [
            'idcontapagar',
            'descricao',
            'valorparcela',
            'numeroparcela',
            'datavencimento',
            'dataquitacao',
            'valordesconto',
            'valorjuros',
            'idpropriedade',
            'idfornecedor',
            'idplanocontas',
        ]

class AReceberSerializer(serializers.ModelSerializer):
    class Meta:
        model = AReceber
        fields = '__all__'

class NotificacaoSerializer(serializers.ModelSerializer):
    # devolve o nome de usuário em vez do id
    usuario = serializers.CharField(
        source='usuario.username',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Notificacao
        fields = [
            'id',
            'tipo',
            'titulo',
            'subtitulo',
            'lida',
            'created_at',
            'usuario',
        ]

class EventoAgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAgenda
        fields = [
            'id',
            'titulo',
            'inicio',
            'fim',
            'tipo',
            'local',
            'participantes',
            'concluido',
            'conta_pagar',
            'conta_receber',
        ]