import csv
from django.core.management.base import BaseCommand
from catalog.models import Book,Author

from django.utils.dateparse import parse_date

class Command(BaseCommand):
    help = 'Import books from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file to import')

    def handle(self, *args, **kwargs):
        file_path = kwargs['csv_file']
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            created_count = 0
            for row in reader:
                author_obj, created = Author.objects.get_or_create(name=row['author'])
                book, created = Book.objects.get_or_create(
                    title=row['title'],
                    author=author_obj,
                    isbn=row['isbn'],
                    published_date=parse_date(row['published_date']),
                    total_copies=int(row['total_copies']),
                    copies_available=int(row['copies_available']),
                    description=row.get('description', '')
                )
                if created:
                    created_count += 1
                #     self.stdout.write(self.style.SUCCESS(f'Book "{book.title}" imported successfully.'))
                # else:
                #     self.stdout.write(self.style.WARNING(f'Book "{book.title}" already exists.'))
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {created_count} books.'))