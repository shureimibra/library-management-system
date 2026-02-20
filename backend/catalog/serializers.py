from rest_framework import serializers

from .models import Author, Category, Book


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for Author model."""

    books_count = serializers.IntegerField(source="books.count", read_only=True)

    class Meta:
        model = Author
        fields = ("id", "name", "bio", "birth_date", "books_count", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at", "books_count")


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    books_count = serializers.IntegerField(source="books.count", read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "description", "books_count", "created_at")
        read_only_fields = ("id", "created_at", "books_count")


class BookSerializer(serializers.ModelSerializer):
    """Serializer for Book model with nested author and categories."""

    author = AuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(), source="author", write_only=True
    )
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), source="categories", write_only=True, required=False
    )
    is_available = serializers.BooleanField(read_only=True)

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "author",
            "author_id",
            "isbn",
            "published_date",
            "total_copies",
            "copies_available",
            "is_available",
            "description",
            "categories",
            "category_ids",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "is_available")

    def validate_isbn(self, value):
        """Ensure ISBN is unique (handled by model, but explicit validation)."""
        if self.instance and self.instance.isbn == value:
            return value
        if Book.objects.filter(isbn=value).exists():
            raise serializers.ValidationError("A book with this ISBN already exists.")
        return value

    def validate(self, attrs):
        """Ensure copies_available doesn't exceed total_copies."""
        total = attrs.get("total_copies", self.instance.total_copies if self.instance else None)
        available = attrs.get("copies_available", self.instance.copies_available if self.instance else None)

        if total is not None and available is not None:
            if available > total:
                raise serializers.ValidationError(
                    {"copies_available": "Available copies cannot exceed total copies."}
                )
        return attrs


class BookListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for book list views (better performance)."""

    author_name = serializers.CharField(source="author.name", read_only=True)
    is_available = serializers.BooleanField(read_only=True)

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "author_name",
            "isbn",
            "copies_available",
            "is_available",
            "published_date",
        )
