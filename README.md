# 📚 Library Management System

A full-stack Library Management System built with Django, Django REST Framework, PostgreSQL, and React.

This system allows authenticated users to borrow and return books, track borrowing history, and manage inventory with role-based permissions.

---

## 🚀 Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Django Filters
- Custom Permissions

### Frontend
- React
- Axios
- Tailwind CSS
- Token-based authentication

---

## 🔐 Features

- User Authentication (JWT)
- Role-Based Access Control (Admin / Member)
- Borrow Books
- Return Books
- Borrowing History
- Active Borrow Tracking
- Overdue Detection
- Pagination & Filtering
- CSV Bulk Book Import
- PostgreSQL Integration

---

## 📂 Project Structure

```
django_library/
│
├── backend/
│   ├── accounts/
│   ├── catalog/
│   ├── borrowing/
│   └── ...
│
├── frontend/
│   ├── src/
│   └── ...
│
└── README.md
```

---

## 🛠 Backend Setup (Local)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 🖥 Frontend Setup (Local)

```bash
cd frontend
npm install
npm start
```

---

## 📥 Bulk Import Books

To import books from CSV:

```bash
python manage.py import_books books.csv
```

CSV Format:

```
title,author,isbn,copies_available
Book One,Author Name,1234567890,5
```

---

## 🔎 API Endpoints (Sample)

- `POST /api/v1/auth/login/`
- `POST /api/v1/borrowing/borrow/`
- `POST /api/v1/borrowing/{id}/return/`
- `GET  /api/v1/borrowing/my-books/`
- `GET  /api/v1/borrowing/my-active/`

---

## 📌 Future Improvements

- Email notifications for overdue books
- Fine calculation system
- Docker containerization
- CI/CD pipeline
- Production deployment

---

## 👨‍💻 Author

Shureim Ibrahim  
Computer Science Student  
Backend Developer (Django / DRF / PostgreSQL)

---


