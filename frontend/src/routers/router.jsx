import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Homepage from "../pages/home/Homepage";
import Login from "../components/Login";
import Register from "../components/Register";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [{
        path: "/",
        element: <Homepage/>
      }]
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