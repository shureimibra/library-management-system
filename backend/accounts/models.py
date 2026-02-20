from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom user model for the Library Management System.

    Requirements covered:
    - Unique username (handled by AbstractUser)
    - Email (we enforce uniqueness)
    - Date of membership (we use `date_joined` from AbstractUser)
    - Active status (`is_active` from AbstractUser)

    We also add an explicit role field for Admin / Member.
    """

    class Roles(models.TextChoices):
        ADMIN = "admin", "Admin"
        MEMBER = "member", "Member"

    # Override email to enforce uniqueness at the DB level
    email = models.EmailField("email address", unique=True)

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.MEMBER,
        help_text="Determines permissions in the API (Admin / Member).",
    )

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"

