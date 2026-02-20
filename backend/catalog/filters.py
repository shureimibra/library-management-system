from django_filters import rest_framework as filters

from .models import Book


class BookFilter(filters.FilterSet):
    """
    FilterSet for Book with a virtual `is_available` filter.

    - `author`: filter by author ID
    - `categories`: filter by category ID
    - `is_available`: true -> copies_available > 0, false -> no extra filter
    """

    is_available = filters.BooleanFilter(method="filter_is_available")

    class Meta:
        model = Book
        fields = ["author", "categories"]

    def filter_is_available(self, queryset, name, value):
        if value:
            return queryset.filter(copies_available__gt=0)
        return queryset

