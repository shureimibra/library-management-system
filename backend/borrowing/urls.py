from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import BorrowRecordViewSet

router = DefaultRouter()
router.register(r"", BorrowRecordViewSet, basename="borrow")

urlpatterns = [
    path("", include(router.urls)),
]
