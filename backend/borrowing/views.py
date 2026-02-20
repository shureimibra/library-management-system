from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from accounts.permissions import IsAdmin, IsOwnerOrAdmin
from .models import BorrowRecord
from .serializers import BorrowRecordSerializer, BorrowRecordListSerializer


class BorrowRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet for BorrowRecord operations.

    Permissions:
    - Admin: can view all records, create/update/delete any
    - Member: can only view/update their own records

    Actions:
    - POST /api/v1/borrowing/borrow/ - borrow a book
    - POST /api/v1/borrowing/{id}/return/ - return a book
    - GET /api/v1/borrowing/my-books/ - get current user's borrowed books
    """

    queryset = BorrowRecord.objects.select_related("user", "book").all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["is_returned", "book", "user"]
    ordering_fields = ["borrowed_date", "due_date"]
    ordering = ["-borrowed_date"]

    def get_serializer_class(self):
        """Use lightweight serializer for list, full for detail."""
        if self.action == "list":
            return BorrowRecordListSerializer
        return BorrowRecordSerializer

    def get_queryset(self):
        """Filter queryset based on user role."""
        queryset = super().get_queryset()
        if self.request.user.role == "admin":
            return queryset
        # Members can only see their own records
        return queryset.filter(user=self.request.user)

    def get_permissions(self):
        """Apply different permissions for different actions."""
        if self.action in ["create", "retrieve", "list"]:
            return [IsAuthenticated()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [IsOwnerOrAdmin()]
        return super().get_permissions()

    @action(detail=False, methods=["post"], url_path="borrow")
    def borrow_book(self, request):
        """
        Borrow a book (alternative to POST /api/v1/borrowing/).
        Validates availability and creates borrow record.
        """
        serializer = BorrowRecordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        borrow_record = serializer.save()
        return Response(
            BorrowRecordSerializer(borrow_record).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="return")
    def return_book(self, request, pk=None):
        """
        Return a borrowed book.
        Sets is_returned=True and updates book availability.
        """
        borrow_record = self.get_object()

        # Check permissions
        if borrow_record.user != request.user and request.user.role != "admin":
            return Response(
                {"detail": "You do not have permission to return this book."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if borrow_record.is_returned:
            return Response(
                {"detail": "This book has already been returned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        borrow_record.is_returned = True
        borrow_record.save()  # This triggers the save() logic to update copies_available

        return Response(
            BorrowRecordSerializer(borrow_record).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"], url_path="my-books")
    def my_borrowed_books(self, request):
        """Get current user's borrowed books (active and returned)."""
        user_records = self.get_queryset().filter(user=request.user)
        page = self.paginate_queryset(user_records)
        serializer_class = BorrowRecordListSerializer
        if page is not None:
            serializer = serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = serializer_class(user_records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="my-active")
    def my_active_borrows(self, request):
        """Get current user's active (not returned) borrowed books."""
        active_records = self.get_queryset().filter(user=request.user, is_returned=False)
        page = self.paginate_queryset(active_records)
        serializer_class = BorrowRecordListSerializer
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(active_records, many=True)
        return Response(serializer.data)
