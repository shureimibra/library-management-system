from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from accounts.permissions import IsAdminOrReadOnly
from .models import Author, Category, Book
from .serializers import AuthorSerializer, CategorySerializer, BookSerializer, BookListSerializer
from .filters import BookFilter


class AuthorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Author CRUD operations.
    - Admin: full CRUD
    - Others: read-only
    """

    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "bio"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]

    @action(detail=True, methods=["get"])
    def books(self, request, pk=None):
        """Get all books by this author."""
        author = self.get_object()
        books = author.books.all()
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category CRUD operations.
    - Admin: full CRUD
    - Others: read-only
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]


class BookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Book CRUD operations.
    - Admin: full CRUD
    - Others: read-only (can view, search, filter)

    Filtering:
    - ?author=<author_id> - filter by author
    - ?category=<category_id> - filter by category
    - ?is_available=true - filter by availability
    - ?search=<term> - search in title, isbn, description
    - ?ordering=<field> - order by field (title, published_date, etc.)
    """

    queryset = Book.objects.select_related("author").prefetch_related("categories").all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = BookFilter
    search_fields = ["title", "isbn", "description", "author__name"]
    ordering_fields = ["title", "published_date", "created_at", "copies_available"]
    ordering = ["title"]

    def get_serializer_class(self):
        """Use lightweight serializer for list, full serializer for detail."""
        if self.action == "list":
            return BookListSerializer
        return BookSerializer

    @action(detail=False, methods=["get"])
    def available(self, request):
        """Get only books with available copies."""
        available_books = self.queryset.filter(copies_available__gt=0)
        page = self.paginate_queryset(available_books)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(available_books, many=True)
        return Response(serializer.data)
