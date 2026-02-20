# Library Management System - Frontend

Modern React frontend for the Library Management API built with Vite, React Router, Tailwind CSS, and React Query.

## 🚀 Features

- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **JWT Authentication**: Secure login/logout with token refresh
- **Role-Based Access**: Separate dashboards for Admin and Member
- **Dynamic Navigation**: Sidebar navigation, no manual URL editing
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 📦 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Framer Motion** - Animations (ready to use)
- **Lucide React** - Icons

## 🛠️ Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   
   Edit `.env` file:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.js     # Axios instance with interceptors
│   ├── auth.js       # Authentication endpoints
│   ├── books.js      # Book endpoints
│   ├── authors.js    # Author endpoints
│   ├── categories.js # Category endpoints
│   ├── borrowing.js  # Borrowing endpoints
│   └── index.js     # Exports
├── components/       # Reusable components
│   ├── Layout/       # Layout components (Sidebar, Navbar)
│   └── ProtectedRoute.jsx
├── context/          # React Context
│   └── AuthContext.jsx
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── MemberDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── Books.jsx
│   ├── MyBooks.jsx
│   ├── AdminBooks.jsx
│   └── AdminBorrows.jsx
├── App.jsx           # Main app with routing
└── main.jsx          # Entry point
```

## 🔐 Authentication Flow

1. **Register** → Creates a new member account
2. **Login** → Gets JWT access + refresh tokens
3. **Protected Routes** → Automatically redirects to login if not authenticated
4. **Token Refresh** → Automatically refreshes expired tokens
5. **Logout** → Clears tokens and redirects to login

## 👥 User Roles

### Member
- Browse and search books
- Borrow available books
- View borrowing history
- Return borrowed books

### Admin
- All member features +
- Manage books (CRUD)
- Manage authors (CRUD)
- Manage categories (CRUD)
- View all borrowing records
- Mark books as returned

## 🎨 Pages

### Public
- `/login` - Login page
- `/register` - Registration page

### Member Routes
- `/dashboard` - Member dashboard with stats
- `/books` - Browse and search books
- `/my-books` - View borrowing history

### Admin Routes
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/books` - Manage books
- `/admin/authors` - Manage authors (to be implemented)
- `/admin/categories` - Manage categories (to be implemented)
- `/admin/borrows` - View all borrowing records

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## 📝 Notes

- The frontend expects the backend API to be running on `http://127.0.0.1:8000`
- JWT tokens are stored in localStorage
- Token refresh happens automatically via Axios interceptors
- All API calls include authentication headers automatically

## 🚧 Future Enhancements

- [ ] Dark mode toggle
- [ ] Form validation with react-hook-form
- [ ] Toast notifications (react-hot-toast)
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Book detail modal/page
- [ ] Author/Category management pages
- [ ] User profile page
- [ ] Pagination component
- [ ] Advanced filtering UI

## 📄 License

MIT
