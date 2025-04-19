import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Homepage from "../pages/home/Homepage";
import Login from "../components/Login";
import Register from "../components/Register";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/Shop/ShopPage";
import SingleProducts from "../pages/Shop/productDetails/SingleProducts";
import PaymentSuccess from "../components/PaymentSuccess";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import UserDMain from "../pages/dashboard/user/dashboard/UserDMain";
import UserOrders from "../pages/dashboard/user/UserOrders";
import OrderDetails from "../pages/dashboard/user/OrderDetails";
import UserPayments from "../pages/dashboard/user/UserPayments";
import UserReviews from "../pages/dashboard/user/UserReviews";
import UserProfile from "../pages/dashboard/user/UserProfile";
import AdminDMain from "../pages/dashboard/admin/dashboard/AdminDMain";
import AddProduct from "../pages/dashboard/admin/addProduct/AddProduct";
import ManageProduct from "../pages/dashboard/admin/manageProduct/ManageProduct";
import UpdateProduct from "../pages/dashboard/admin/manageProduct/UpdateProduct";
import ManageUsers from "../pages/dashboard/admin/users/ManageUsers";
import ManageOrders from "../pages/dashboard/admin/manageOrders/ManageOrders";
import ViewOrder from "../pages/dashboard/admin/manageOrders/ViewOrder";
import Checkout from "../components/Checkout";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {path: "/", element: <Homepage/>},
        {path: "/categories/:categoryName", element: <CategoryPage />},
        {path: "/search", element: <Search />},
        {path: "/shop", element: <ShopPage />},
        {path: "/shop/:id", element: <SingleProducts />},
        {
          path: "/success",
          element: <PaymentSuccess />
        },
        {
          path: "/orders/:orderId",
          element: <OrderDetails/>
        },
        {
          path: "/checkout",
          element: <Checkout />
        }
        
      ]
    },
    {
      path:"/login",
      element:<Login />
    },
    {
      path:"/register",
      element: <Register />
    },

    //dashboard routes starts here
    {
      path: "/dashboard", 
      element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
      children: [
        //user routes
        {path: '', element: <UserDMain/>},
        {path: 'orders', element: <UserOrders/>},
        {path: 'payments', element: <UserPayments/>},
        {path: 'profile', element: <UserProfile/>},
        {path: 'reviews', element: <UserReviews/>},

        //admin routes
        {
          path: 'admin', 
          element: <PrivateRoute role="admin"><AdminDMain /></PrivateRoute>
        },
        {
          path: 'add-product', 
          element: <PrivateRoute role="admin"><AddProduct/></PrivateRoute>
        },
        {
          path: 'manage-products', 
          element: <PrivateRoute role="admin"><ManageProduct /></PrivateRoute>
        },
        {
          path: 'update-product/:id', 
          element: <PrivateRoute role="admin"><UpdateProduct /></PrivateRoute>
        },
        {
          path: 'users', 
          element: <PrivateRoute role="admin"><ManageUsers /></PrivateRoute>
        },
        {
          path: 'manage-orders', 
          element: <PrivateRoute role="admin"><ManageOrders /></PrivateRoute>
        },
        {
          path: 'view-orders/:orderId', 
          element: <PrivateRoute role="admin"><ViewOrder /></PrivateRoute>
        },
      ] 
    }
  ]);
  export default router