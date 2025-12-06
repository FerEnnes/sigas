from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from .serializers import UsuarioSerializer
from cadastros.models import Notificacao
from cadastros.serializers import NotificacaoSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('first_name')
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['put'], url_path='inativar')
    def inativar(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response(self.get_serializer(user).data)

    @action(detail=True, methods=['put'], url_path='ativar')
    def ativar(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response(self.get_serializer(user).data)


class LoginAPIView(ObtainAuthToken):
    """
    POST /api/login/
    body: { "username": "...", "password": "..." }

    Retorna: token + dados do usuário + tipousuario do PerfilUsuario
    """
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        token, created = Token.objects.get_or_create(user=user)
        perfil = getattr(user, 'perfil', None)

        return Response({
            'token': token.key,
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'tipousuario': perfil.tipousuario if perfil else 2,
        })


class NotificacaoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lista notificações NÃO lidas.

    - Se usuário estiver autenticado:
        - Notificações gerais (usuario=None)
        - Notificações específicas para ele (usuario = request.user)
    """
    serializer_class = NotificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        qs = Notificacao.objects.filter(lida=False)

        if user.is_authenticated:
            qs = qs.filter(
                Q(usuario__isnull=True) | Q(usuario=user)
            )

        return qs.order_by('-created_at')


_token_generator = PasswordResetTokenGenerator()


class SolicitarRedefinicaoSenhaAPIView(APIView):
    """
    POST /api/solicitar-redefinicao/
    body: { "email": "usuario@email.com" }

    Sempre responde 200 com mensagem genérica.
    Se o email existir, manda o link de redefinição por e-mail.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = (request.data.get('email') or '').strip().lower()

        if not email:
            return Response(
                {"detail": "Email é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email__iexact=email, is_active=True)
        except User.DoesNotExist:
            return Response({
                "detail": "Se o email estiver cadastrado, enviaremos instruções para redefinir sua senha."
            })

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = _token_generator.make_token(user)

        frontend_base = getattr(
            settings,
            "FRONTEND_URL",
            "http://localhost:3000"
        )
        reset_link = f"{frontend_base}/redefinir-senha/{uidb64}/{token}"

        assunto = "[SIGAS] Redefinição de senha"
        corpo = (
            f"Olá {user.first_name or user.username},\n\n"
            f"Recebemos um pedido para redefinir a senha da sua conta no SIGAS.\n\n"
            f"Use o link abaixo para criar uma nova senha:\n"
            f"{reset_link}\n\n"
            f"Se você não solicitou essa alteração, apenas ignore este e-mail."
        )

        send_mail(
            subject=assunto,
            message=corpo,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({
            "detail": "Se o email estiver cadastrado, enviaremos instruções para redefinir sua senha."
        })


class RedefinirSenhaAPIView(APIView):
    """
    POST /api/redefinir-senha/<uidb64>/<token>/
    body: { "senha": "nova_senha" }
    """
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, *args, **kwargs):
        nova_senha = request.data.get("senha") or ""

        if not nova_senha:
            return Response(
                {"detail": "Senha é obrigatória."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(nova_senha) < 8:
            return Response(
                {"detail": "A senha deve ter pelo menos 8 caracteres."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid, is_active=True)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Link inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not _token_generator.check_token(user, token):
            return Response(
                {"detail": "Token inválido ou expirado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(nova_senha)
        user.save()

        Notificacao.objects.create(
            usuario=user,
            tipo="sistema",
            titulo="Senha alterada com sucesso",
            subtitulo="Caso não tenha sido você, entre em contato com o suporte."
        )

        return Response({"detail": "Senha redefinida com sucesso."})
