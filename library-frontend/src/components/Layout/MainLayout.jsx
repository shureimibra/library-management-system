import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
