import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../redux/features/auth/authApi";
import { setUser } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import TestimonialSlider from "./TestimonialSlider";

const Login = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  //handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    try {
      const response = await loginUser(data).unwrap();
      console.log(response);
      const { token, user } = response;
      dispatch(setUser(user));
      // alert("Login successful");
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed");
      setMessage("Please provide a valid email and password");
    }
  };
  return (
    <div className="flex h-screen">
      {/* Left side - Registration Form */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className = 'nav__logo mb-6'>
                <Link to = "/">Wholesale<span>.</span></Link>
            </div>

          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-gray-600 mb-8">
          Start your wholesale journey — it's simple and seamless.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 pt-8">
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Optional Eye Icon - add toggle logic if you want later */}
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {message && <p className="text-red-500 text-sm">{message}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Testimonial Image and Info */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-zinc-700 to-slate-400 relative p-0 m-0">
        <TestimonialSlider />
      </div>
    </div>
  );
};
export default Login;
