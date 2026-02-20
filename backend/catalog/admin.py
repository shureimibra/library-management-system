from django.contrib import admin

from .models import Author, Category, Book


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name", "birth_date", "created_at")
    search_fields = ("name", "bio")
    list_filter = ("created_at",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name", "description")


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "isbn", "copies_available", "total_copies", "is_available", "created_at")
    list_filter = ("author", "categories", "published_date", "created_at")
    search_fields = ("title", "isbn", "author__name")
    filter_horizontal = ("categories",)
    readonly_fields = ("created_at", "updated_at")

    def is_available(self, obj):
        return obj.is_available()
    is_available.boolean = True
    is_available.short_description = "Available"
