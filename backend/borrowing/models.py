from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator

from accounts.models import User
from catalog.models import Book


class BorrowRecord(models.Model):
    """
    Tracks book borrowing transactions.

    Requirements:
    - User can only borrow one copy of a book at a time
    - Track checkout date and return date
    - Automatically update copies_available on borrow/return
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="borrow_records")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="borrow_records")
    borrowed_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    returned_date = models.DateTimeField(blank=True, null=True)
    is_returned = models.BooleanField(default=False)

    class Meta:
        ordering = ["-borrowed_date"]
        indexes = [
            models.Index(fields=["user", "is_returned"]),
            models.Index(fields=["book", "is_returned"]),
            models.Index(fields=["due_date"]),
        ]
        # Ensure a user can only have one active borrow per book
        constraints = [
            models.UniqueConstraint(
                fields=["user", "book"],
                condition=models.Q(is_returned=False),
                name="unique_active_borrow",
            )
        ]

    def __str__(self) -> str:
        status = "Returned" if self.is_returned else "Borrowed"
        return f"{self.user.username} - {self.book.title} ({status})"

    def is_overdue(self) -> bool:
        """Check if the book is overdue."""
        if self.is_returned:
            return False
        return timezone.now() > self.due_date

    def save(self, *args, **kwargs):
        """Handle borrow/return logic and update book availability."""
        is_new = self.pk is None
        was_returned = False

        if not is_new:
            old_instance = BorrowRecord.objects.get(pk=self.pk)
            was_returned = old_instance.is_returned

        super().save(*args, **kwargs)

        # On borrow: reduce copies_available
        if is_new and not self.is_returned:
            self.book.copies_available = max(0, self.book.copies_available - 1)
            self.book.save(update_fields=["copies_available"])

        # On return: increase copies_available
        elif not is_new and not was_returned and self.is_returned:
            if not self.returned_date:
                self.returned_date = timezone.now()
                self.save(update_fields=["returned_date"])
            self.book.copies_available = min(
                self.book.total_copies, self.book.copies_available + 1
            )
            self.book.save(update_fields=["copies_available"])
