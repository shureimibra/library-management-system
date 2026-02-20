import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowingAPI } from '../api';
import { Clock, CheckCircle, BookOpen, Loader } from 'lucide-react';

const MyBooks = () => {
  const queryClient = useQueryClient();

  const { data: myBooks, isLoading } = useQuery({
    queryKey: ['my-books'],
    queryFn: () => borrowingAPI.getMyBooks(),
  });

  const { data: activeBooks } = useQuery({
    queryKey: ['my-active'],
    queryFn: () => borrowingAPI.getMyActive(),
  });

  const returnMutation = useMutation({
    mutationFn: (id) => borrowingAPI.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-books']);
      queryClient.invalidateQueries(['my-active']);
      alert('Book returned successfully!');
    },
  });

  const handleReturn = (borrowId) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      returnMutation.mutate(borrowId);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader className="animate-spin mx-auto text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        <p className="text-gray-600 mt-1">View your borrowing history</p>
      </div>

      {/* Active Borrows */}
      {activeBooks?.results?.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-yellow-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Active Borrows</h2>
          </div>
          <div className="space-y-3">
            {activeBooks.results.map((borrow) => {
              const dueDate = new Date(borrow.due_date);
              const isOverdue = dueDate < new Date();
              return (
                <div
                  key={borrow.id}
                  className={`p-4 rounded-lg border ${
                    isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{borrow.book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ISBN: {borrow.book_isbn}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-600">
                          Borrowed: {new Date(borrow.borrowed_date).toLocaleDateString()}
                        </span>
                        <span
                          className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}
                        >
                          Due: {dueDate.toLocaleDateString()}
                        </span>
                      </div>
                      {isOverdue && (
                        <p className="text-sm text-red-600 font-medium mt-2">
                          ⚠️ This book is overdue
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleReturn(borrow.id)}
                      className="btn-primary ml-4"
                    >
                      Return
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Borrowing History */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="text-green-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Borrowing History</h2>
        </div>
        {myBooks?.results?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Book</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Borrowed</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Returned</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {myBooks.results.map((borrow) => (
                  <tr key={borrow.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{borrow.book_title}</p>
                        <p className="text-xs text-gray-500">{borrow.book_isbn}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(borrow.borrowed_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {borrow.returned_date
                        ? new Date(borrow.returned_date).toLocaleDateString()
                        : '-'}
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
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No borrowing history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
