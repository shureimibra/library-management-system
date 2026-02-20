import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowingAPI } from '../api';
import { Clock, CheckCircle, Loader } from 'lucide-react';

const AdminBorrows = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['borrows'],
    queryFn: () => borrowingAPI.getAll(),
  });

  const returnMutation = useMutation({
    mutationFn: (id) => borrowingAPI.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['borrows']);
      alert('Book returned successfully');
    },
  });

  const handleReturn = (id) => {
    if (window.confirm('Mark this book as returned?')) {
      returnMutation.mutate(id);
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
        <h1 className="text-3xl font-bold text-gray-900">Borrowing Records</h1>
        <p className="text-gray-600 mt-1">View and manage all borrowing transactions</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Book</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Borrowed</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Returned</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.results?.map((borrow) => {
                const dueDate = new Date(borrow.due_date);
                const isOverdue = dueDate < new Date() && !borrow.is_returned;
                return (
                  <tr key={borrow.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{borrow.user}</td>
                    <td className="py-3 px-4">{borrow.book_title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(borrow.borrowed_date).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-3 px-4 text-sm ${
                        isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {dueDate.toLocaleDateString()}
                      {isOverdue && ' ⚠️'}
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
                            : isOverdue
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {borrow.is_returned ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {!borrow.is_returned && (
                        <button
                          onClick={() => handleReturn(borrow.id)}
                          className="btn-primary text-sm ml-auto"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBorrows;
