from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(APIView):
    """Allow anyone to register. New users get role=member."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(user).data,
                "message": "User registered successfully. Use /api/v1/auth/token/ to obtain JWT.",
            },
            status=status.HTTP_201_CREATED,
        )


# Re-export JWT views with consistent naming; we'll mount these in urls.py
# - TokenObtainPairView: POST username + password -> access + refresh
# - TokenRefreshView: POST refresh -> new access
# - TokenBlacklistView: POST refresh -> blacklist refresh (logout)
ObtainTokenView = TokenObtainPairView
RefreshTokenView = TokenRefreshView
LogoutView = TokenBlacklistView
