import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {user?.username}!
          </h2>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
            {user?.role === 'admin' ? 'Admin' : 'Member'}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
