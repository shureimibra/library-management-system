import { useQuery } from '@tanstack/react-query';
import { booksAPI, borrowingAPI } from '../api';
import { BookOpen, Clock, CheckCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ['books', searchTerm],
    queryFn: () => booksAPI.getAll({ search: searchTerm }),
  });

  const { data: myBooks, isLoading: myBooksLoading } = useQuery({
    queryKey: ['my-books'],
    queryFn: () => borrowingAPI.getMyBooks(),
  });

  const { data: activeBooks } = useQuery({
    queryKey: ['my-active'],
    queryFn: () => borrowingAPI.getMyActive(),
  });

  const stats = [
    {
      label: 'Total Books',
      value: books?.count || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      label: 'My Borrowed',
      value: myBooks?.results?.length || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'Active Borrows',
      value: activeBooks?.results?.length || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
        <p className="text-gray-600 mt-1">Browse books and manage your borrows</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Link to="/books" className="btn-primary">
            Browse All Books
          </Link>
        </div>

        {/* Recent Books */}
        {booksLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : books?.results?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.results.slice(0, 6).map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{book.author_name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      book.is_available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {book.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {book.copies_available} copies
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No books found</div>
        )}
      </div>

      {/* My Active Borrows */}
      {activeBooks?.results?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Active Borrows</h2>
          <div className="space-y-2">
            {activeBooks.results.map((borrow) => (
              <div
                key={borrow.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{borrow.book_title}</p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(borrow.due_date).toLocaleDateString()}
                  </p>
                </div>
                <Link to="/my-books" className="btn-secondary text-sm">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
