import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksAPI, borrowingAPI } from '../api';
import { Search, BookOpen, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['books', searchTerm, selectedAuthor, selectedCategory, isAvailable],
    queryFn: () =>
      booksAPI.getAll({
        search: searchTerm || undefined,
        author: selectedAuthor || undefined,
        categories: selectedCategory || undefined,
        is_available: isAvailable || undefined,
      }),
  });

  const handleBorrow = async (bookId) => {
    try {
      await borrowingAPI.borrow({ book_id: bookId });
      alert('Book borrowed successfully!');
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data); // Always log this
      // This will now show if it's because book is unavailable or already borrowed
      alert(
        error.response?.data?.book_id?.[0] ||
        error.response?.data?.detail ||
        'Failed to borrow book'
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
        <p className="text-gray-600 mt-1">Discover and borrow books from our collection</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="input-field"
          >
            <option value="">All Authors</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
          </select>
          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value)}
            className="input-field"
          >
            <option value="">All Books</option>
            <option value="true">Available Only</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader className="animate-spin mx-auto text-primary-600" size={32} />
        </div>
      ) : data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map((book) => (
            <div key={book.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{book.author_name}</p>
                  <p className="text-xs text-gray-500 mt-1">ISBN: {book.isbn}</p>
                </div>
                <BookOpen className="text-primary-600" size={24} />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
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
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/books/${book.id}`}
                  className="btn-secondary flex-1 text-center text-sm"
                >
                  View Details
                </Link>
                {book.is_available && (
                  <button
                    onClick={() => handleBorrow(book.id)}
                    className="btn-primary flex-1 text-sm"
                  >
                    Borrow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No books found</p>
        </div>
      )}

      {/* Pagination */}
      {data?.next && (
        <div className="text-center">
          <button className="btn-secondary">Load More</button>
        </div>
      )}
    </div>
  );
};

export default Books;
