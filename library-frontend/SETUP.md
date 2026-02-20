# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Backend URL

Make sure `.env` has:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## 3. Start Backend

In the Django project directory:
```bash
python manage.py runserver
```

## 4. Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 5. Testing Admin Role

Since user role is currently set to 'member' by default, to test admin features:

1. Login as a user
2. Open browser DevTools → Application → Local Storage
3. Find the `user` key
4. Edit it to change `"role": "member"` to `"role": "admin"`
5. Refresh the page

**Note**: In production, you should decode the JWT token or create a `/me` endpoint to get the actual user role from the backend.

## 6. First Steps

1. **Register** a new account at `/register`
2. **Login** at `/login`
3. **Browse books** at `/books`
4. **Borrow a book** (if available)
5. **View your books** at `/my-books`
6. **Return books** from your active borrows

## Troubleshooting

- **CORS errors**: Make sure Django CORS headers are configured
- **401 errors**: Check if tokens are being stored correctly
- **API not found**: Verify backend is running and URL is correct
