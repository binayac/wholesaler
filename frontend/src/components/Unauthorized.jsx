import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="text-6xl text-red-500 mb-4">
        <i className="ri-shield-cross-line"></i>
      </div>
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You don't have permission to access this page.
      </p>
      <div className="space-x-4">
        <Link 
          to="/" 
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-200"
        >
          Return Home
        </Link>
        <Link 
          to="/dashboard/profile" 
          className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;