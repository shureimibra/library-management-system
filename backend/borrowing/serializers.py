from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from accounts.models import User
from catalog.models import Book
from catalog.serializers import BookListSerializer
from .models import BorrowRecord


class BorrowRecordSerializer(serializers.ModelSerializer):
    """Serializer for BorrowRecord with nested book info."""

    book = BookListSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.filter(copies_available__gt=0), source="book", write_only=True
    )
    user = serializers.StringRelatedField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    due_date = serializers.DateTimeField(required=False)


    class Meta:
        model = BorrowRecord
        fields = (
            "id",
            "user",
            "book",
            "book_id",
            "borrowed_date",
            "due_date",
            "returned_date",
            "is_returned",
            "is_overdue",
        )
        read_only_fields = ("id", "user", "borrowed_date", "returned_date", "is_overdue")

    def validate_book_id(self, value):
        """Ensure book has available copies."""
        if value.copies_available <= 0:
            raise serializers.ValidationError("This book is not available for borrowing.")
        return value

    def validate(self, attrs):
        """Ensure user doesn't already have an active borrow for this book."""
        user = self.context["request"].user
        book = attrs.get("book")

        if not self.instance:  # Creating new borrow
            existing = BorrowRecord.objects.filter(user=user, book=book, is_returned=False).exists()
            if existing:
                raise serializers.ValidationError(
                    {"book_id": "You already have an active borrow for this book."}
                )

        # Set due_date if not provided (default: 14 days from now)
        if "due_date" not in attrs:
            attrs["due_date"] = timezone.now() + timedelta(days=14)

        return attrs

    def create(self, validated_data):
        """Create borrow record and set user from request."""
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class BorrowRecordListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""

    book_title = serializers.CharField(source="book.title", read_only=True)
    book_isbn = serializers.CharField(source="book.isbn", read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = BorrowRecord
        fields = (
            "id",
            "book_title",
            "book_isbn",
            "borrowed_date",
            "due_date",
            "returned_date",
            "is_returned",
            "is_overdue",
        )
