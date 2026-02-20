from django.contrib import admin

from .models import BorrowRecord


@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "borrowed_date", "due_date", "is_returned", "returned_date", "is_overdue")
    list_filter = ("is_returned", "borrowed_date", "due_date")
    search_fields = ("user__username", "book__title", "book__isbn")
    readonly_fields = ("borrowed_date", "returned_date")

    def is_overdue(self, obj):
        return obj.is_overdue()
    is_overdue.boolean = True
    is_overdue.short_description = "Overdue"
