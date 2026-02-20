import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Books from './pages/Books';
import MyBooks from './pages/MyBooks';
import AdminBooks from './pages/AdminBooks';
import AdminBorrows from './pages/AdminBorrows';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Member routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              {isAdmin() ? <AdminDashboard /> : <MemberDashboard />}
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Books />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-books"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyBooks />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/books"
        element={
          <ProtectedRoute requireAdmin>
            <MainLayout>
              <AdminBooks />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/borrows"
        element={
          <ProtectedRoute requireAdmin>
            <MainLayout>
              <AdminBorrows />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
