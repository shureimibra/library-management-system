from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("token/", views.ObtainTokenView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", views.RefreshTokenView.as_view(), name="token_refresh"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
]
