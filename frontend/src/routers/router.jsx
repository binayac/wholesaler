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
    }
  ]);
  export default router