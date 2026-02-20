import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksAPI } from '../api';
import { Plus, Search, Edit, Trash2, Loader } from 'lucide-react';

const AdminBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['books', searchTerm],
    queryFn: () => booksAPI.getAll({ search: searchTerm }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => booksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      alert('Book deleted successfully');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <p className="text-gray-600 mt-1">Create, update, and delete books</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Book
        </button>
      </div>

      {/* Search */}
      <div className="card">
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
      </div>

      {/* Books Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader className="animate-spin mx-auto text-primary-600" size={32} />
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Author</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ISBN</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Copies</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.results?.map((book) => (
                  <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{book.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{book.author_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{book.isbn}</td>
                    <td className="py-3 px-4 text-sm">
                      {book.copies_available} / {book.total_copies}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          book.is_available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {book.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingBook(book);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal placeholder - you can expand this */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            <p className="text-gray-600 mb-4">
              Book form would go here (title, author, ISBN, copies, etc.)
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button className="btn-primary flex-1">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
