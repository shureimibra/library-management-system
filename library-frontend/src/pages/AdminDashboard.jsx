import { useQuery } from '@tanstack/react-query';
import { booksAPI, borrowingAPI, authorsAPI, categoriesAPI } from '../api';
import { BookOpen, Users, Tag, Clock, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: () => booksAPI.getAll(),
  });

  const { data: borrows } = useQuery({
    queryKey: ['borrows'],
    queryFn: () => borrowingAPI.getAll(),
  });

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: () => authorsAPI.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const stats = [
    {
      label: 'Total Books',
      value: books?.count || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      link: '/admin/books',
    },
    {
      label: 'Total Authors',
      value: authors?.count || 0,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/authors',
    },
    {
      label: 'Total Categories',
      value: categories?.count || 0,
      icon: Tag,
      color: 'bg-green-500',
      link: '/admin/categories',
    },
    {
      label: 'Total Borrows',
      value: borrows?.count || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/borrows',
    },
  ];

  const activeBorrows = borrows?.results?.filter((b) => !b.is_returned) || [];
  const overdueBorrows = activeBorrows.filter((b) => {
    const dueDate = new Date(b.due_date);
    return dueDate < new Date() && !b.is_returned;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your library management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.label}
              href={stat.link}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Active Borrows</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeBorrows.length}</p>
          <p className="text-sm text-gray-600 mt-2">
            {borrows?.count - activeBorrows.length} returned
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-red-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Overdue Books</h2>
          </div>
          <p className="text-3xl font-bold text-red-600">{overdueBorrows.length}</p>
          <p className="text-sm text-gray-600 mt-2">Requires attention</p>
        </div>
      </div>

      {/* Recent Borrows */}
      {borrows?.results?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Borrows</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Book</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Borrowed</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {borrows.results.slice(0, 5).map((borrow) => (
                  <tr key={borrow.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm">{borrow.user}</td>
                    <td className="py-3 px-4 text-sm font-medium">{borrow.book_title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(borrow.borrowed_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          borrow.is_returned
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {borrow.is_returned ? 'Returned' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
