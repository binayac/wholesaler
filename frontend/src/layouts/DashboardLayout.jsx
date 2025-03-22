import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Menu links based on user role
  const adminLinks = [
    { path: '/dashboard/admin', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { path: '/dashboard/manage-products', label: 'Manage Products', icon: 'ri-shopping-bag-line' },
    { path: '/dashboard/manage-orders', label: 'Manage Orders', icon: 'ri-file-list-3-line' },
    { path: '/dashboard/add-new-post', label: 'Add New Post', icon: 'ri-add-circle-line' },
    { path: '/dashboard/profile', label: 'Profile', icon: 'ri-user-line' },
  ];
  
  const userLinks = [
    { path: '/dashboard/profile', label: 'Profile', icon: 'ri-user-line' },
    { path: '/dashboard/orders', label: 'My Orders', icon: 'ri-shopping-cart-line' },
    { path: '/dashboard/payments', label: 'Payments', icon: 'ri-bank-card-line' },
  ];
  
  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
          </h2>
          <p className="text-sm text-gray-600">Welcome, {user?.name || 'User'}</p>
        </div>
        
        <nav className="mt-6">
          <ul>
            {links.map((link) => (
              <li key={link.path} className="mb-2">
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-3 ${
                    location.pathname === link.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${link.icon} mr-3`}></i>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mb-2">
              <Link to="/" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <i className="ri-home-line mr-3"></i>
                Back to Home
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;