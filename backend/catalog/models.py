from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone


class Author(models.Model):
    """Author model for books."""

    name = models.CharField(max_length=200, unique=True)
    bio = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Category(models.Model):
    """Category model for book categorization."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Book(models.Model):
    """
    Book model with ISBN uniqueness, copies tracking, and relationships.

    Requirements:
    - Title, Author (FK), ISBN (unique), Published Date, Number of Copies Available
    - ManyToMany with Category
    """

    title = models.CharField(max_length=300)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    isbn = models.CharField(max_length=13, unique=True, help_text="ISBN-13 format")
    published_date = models.DateField(blank=True, null=True)
    total_copies = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1)], help_text="Total copies in library"
    )
    copies_available = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(0)],
        help_text="Currently available copies (updated on borrow/return)",
    )
    description = models.TextField(blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name="books", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]
        indexes = [
            models.Index(fields=["isbn"]),
            models.Index(fields=["title"]),
            models.Index(fields=["copies_available"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} by {self.author.name}"

    def is_available(self) -> bool:
        """Check if book has available copies."""
        return self.copies_available > 0

    def save(self, *args, **kwargs):
        """Ensure copies_available doesn't exceed total_copies."""
        if self.copies_available > self.total_copies:
            self.copies_available = self.total_copies
        super().save(*args, **kwargs)
