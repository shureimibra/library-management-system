# How to use this API (Admin & Member)

This guide explains **exactly how admins and members should use** the Library Management API.

## 1) Start the project (everyone)

```powershell
python manage.py migrate
python manage.py runserver
```

Base URL (local): `http://127.0.0.1:8000/`

## 2) Roles (important)

- **Member**
  - Can **view/search/filter** books
  - Can **borrow/return** books
  - Can only see **their own** borrowing records
- **Admin**
  - Can **create/update/delete** authors, categories, and books
  - Can view **all** borrowing records

### How to make an Admin (project owner / superuser)

Registration creates **members only**.

1. Create a superuser:
   ```powershell
   python manage.py createsuperuser
   ```
2. Login to Django admin: `http://127.0.0.1:8000/admin/`
3. Go to **Users** → choose a user → set `role` to **admin** → Save.

## 3) Authentication flow (Member & Admin)

### A) Register (public)

**POST** `/api/v1/auth/register/`

Body:
```json
{
  "username": "member1",
  "email": "member1@example.com",
  "password": "securepass123",
  "password_confirm": "securepass123"
}
```

### B) Login (get JWT tokens)

**POST** `/api/v1/auth/token/`

Body:
```json
{
  "username": "member1",
  "password": "securepass123"
}
```

Response contains:
- `access` (short-lived)
- `refresh` (used to refresh / logout)

### C) Use the access token

Add this header on protected endpoints:

`Authorization: Bearer <access>`

### D) Refresh token

**POST** `/api/v1/auth/token/refresh/`

Body:
```json
{ "refresh": "<refresh>" }
```

### E) Logout (blacklist refresh token)

**POST** `/api/v1/auth/logout/`

Body:
```json
{ "refresh": "<refresh>" }
```

## 4) Catalog usage (Books / Authors / Categories)

All catalog endpoints are under: `/api/v1/catalog/`

### Member actions (read-only)

#### List books
**GET** `/api/v1/catalog/books/`

#### Search books
**GET** `/api/v1/catalog/books/?search=harry`

Search includes: title, isbn, description, author name.

#### Filter books
- By author:
  - **GET** `/api/v1/catalog/books/?author=<author_id>`
- By category:
  - **GET** `/api/v1/catalog/books/?categories=<category_id>`
- By availability:
  - **GET** `/api/v1/catalog/books/?is_available=true`

#### Order books
**GET** `/api/v1/catalog/books/?ordering=published_date`
or descending:
**GET** `/api/v1/catalog/books/?ordering=-copies_available`

#### Only available books (shortcut)
**GET** `/api/v1/catalog/books/available/`

### Admin actions (manage catalog)

Admins can create/update/delete:
- **Authors**: `/api/v1/catalog/authors/`
- **Categories**: `/api/v1/catalog/categories/`
- **Books**: `/api/v1/catalog/books/`

Example: create an author

**POST** `/api/v1/catalog/authors/` (admin access token required)
```json
{ "name": "George Orwell" }
```

Example: create a category

**POST** `/api/v1/catalog/categories/` (admin access token required)
```json
{ "name": "Dystopian" }
```

Example: create a book

**POST** `/api/v1/catalog/books/` (admin access token required)
```json
{
  "title": "1984",
  "author_id": 1,
  "isbn": "9780451524935",
  "published_date": "1949-06-08",
  "total_copies": 3,
  "copies_available": 3,
  "description": "Classic dystopian novel.",
  "category_ids": [1]
}
```

## 5) Borrowing usage (Member & Admin)

All borrowing endpoints are under: `/api/v1/borrowing/` and require authentication.

### Member actions

#### Borrow a book
**POST** `/api/v1/borrowing/borrow/`

Body:
```json
{ "book_id": 1 }
```

Rules enforced:
- You can’t borrow if `copies_available = 0`
- You can’t borrow the **same book twice** while you still have an active borrow
- Borrowing will **decrease** `copies_available` automatically

#### View my borrowing history
**GET** `/api/v1/borrowing/my-books/`

#### View my active borrows only
**GET** `/api/v1/borrowing/my-active/`

#### Return a book
1. Find the borrow record id from `my-active`
2. **POST** `/api/v1/borrowing/<borrow_id>/return/`

Returning will:
- Mark record as returned
- Set `returned_date`
- **Increase** `copies_available` automatically (up to `total_copies`)

### Admin actions

Admins can view all borrow records:
- **GET** `/api/v1/borrowing/`

Admins can also return a book on behalf of a user (same return endpoint).

## 6) Quick Postman setup

- Create a collection “Library API”
- Add an environment variable:
  - `base_url` = `http://127.0.0.1:8000`
  - `access_token` = (set after login)
  - `refresh_token` = (set after login)
- Use `{{base_url}}/api/v1/...` URLs
- For protected routes add header:
  - `Authorization: Bearer {{access_token}}`

## 7) Common errors and what they mean

- **401 Unauthorized**: missing/expired access token → login again or refresh token
- **403 Forbidden**: wrong role (member trying to create/update/delete catalog data)
- **400 Bad Request**:
  - ISBN already exists
  - Borrowing a book with no available copies
  - Borrowing same book twice without returning

