# Library Management API (Django + DRF)

This project is a **scalable Library Management System API** built with:

- Django
- Django REST Framework
- PostgreSQL
- Simple JWT authentication

It is designed as a **production-ready backend** showcasing:

- Role-based access (Admin / Member)
- Book catalog and search
- Borrowing / returning workflow
- Pagination, filtering, and ordering

## Initial Setup

1. **Create and activate a virtualenv (recommended)**  
   On Windows (PowerShell):
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment variables**
   Create a `.env` file in the project root:
   ```env
   SECRET_KEY=your-production-secret-key
   DEBUG=True
   ALLOWED_HOSTS=127.0.0.1,localhost

   DB_NAME=library_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=127.0.0.1
   DB_PORT=5432
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## High-Level Architecture

- `config/` – Django project, global settings and root URLs
- `accounts/` – custom user model, authentication, roles (Admin / Member)
- `catalog/` – authors, categories, books
- `borrowing/` – borrowing records, rules, and business logic

We will add:

- DRF `ViewSet`s and routers
- JWT authentication endpoints
- Custom permissions
- Pagination, filtering, and search

Implementation will be done **step-by-step**, keeping the codebase clean and maintainable.

## Usage (Admin & Member)

See `USAGE.md` for the step-by-step guide for:

- Register / login / refresh / logout
- How admins manage books/authors/categories
- How members borrow/return and view their history


