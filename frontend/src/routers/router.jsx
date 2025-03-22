import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Homepage from "../pages/home/Homepage";
import Login from "../components/Login";
import Register from "../components/Register";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/Shop/ShopPage";
import SingleProducts from "../pages/Shop/productDetails/SingleProducts";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../components/Unauthorized";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/dashboard/Profile";
import ManageProducts from "../pages/dashboard/ManageProducts";
import ManageOrders from "../pages/dashboard/ManageOrders";
import AddNewPost from "../pages/dashboard/AddNewPost";
import UserOrders from "../pages/dashboard/UserOrders";
import UserPayments from "../pages/dashboard/UserPayments";
import Contact from "../pages/Contact";
import Pages from "../pages/Pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/categories/:categoryName", element: <CategoryPage /> },
      { path: "/search", element: <Search /> },
      { path: "/shop", element: <ShopPage /> },
      { path: "/shop/:id", element: <SingleProducts /> },
      { path: "/contact", element: <Contact /> },
      { path: "/pages", element: <Pages /> },
      { path: "/unauthorized", element: <Unauthorized /> },
      
      // Dashboard with nested routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          // Admin routes
          {
            path: "admin",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            )
          },
          {
            path: "manage-products",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageProducts />
              </ProtectedRoute>
            )
          },
          {
            path: "manage-orders",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageOrders />
              </ProtectedRoute>
            )
          },
          {
            path: "add-new-post",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddNewPost />
              </ProtectedRoute>
            )
          },
          
          // User routes (accessible by all logged in users)
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "payments",
            element: <UserPayments />
          },
          {
            path: "orders",
            element: <UserOrders />
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

export default router;