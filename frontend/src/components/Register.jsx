import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import womanImg from '../assets/woman.png'
import TestimonialSlider from "./TestimonialSlider";

const Register = () => {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("regular"); // "regular" or "wholesaler"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Wholesaler fields
  const [businessName, setBusinessName] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [taxId, setTaxId] = useState("");

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const data = {
      username,
      email,
      password,
    };

    if (role === "wholesaler") {
      data.businessName = businessName;
      data.businessLicense = businessLicense;
      data.taxId = taxId;
      data.role = "wholesaler"; // optional: send this explicitly if backend uses it
    } else {
      data.role = "regular";
    }

    try {
      await registerUser(data).unwrap();
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      setMessage("Registration Failed");
    }
  };

  return (
    <div className="flex h-full md:h-screen flex-col-reverse md:flex-row">
  {/* Left side - Registration Form */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
    <div className="w-full max-w-md">
      {/* Logo/Brand */}
      <div className = 'nav__logo mb-6'>
                <Link to = "/">Wholesale<span>.</span></Link>
            </div>

      <h1 className="text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-gray-600 mb-8">Start your wholesale journey — it's simple and seamless.</p>

      <form onSubmit={handleRegister} className="space-y-4">
  {/* Username */}
  <div>
    <input
      type="text"
      name="username"
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Username"
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Email */}
  <div>
    <input
      type="email"
      name="email"
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Password */}
  <div className="relative">
    <input
      type="password"
      name="password"
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Create a password"
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button type="button" className="absolute right-3 top-3 text-gray-400">
      {/* Eye icon */}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  </div>

  {/* Role selection */}
  <div>
    <select
      name="role"
      onChange={(e) => setRole(e.target.value)}
      value={role}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Role</option>
      <option value="customer">Customer</option>
      <option value="wholesaler">Wholesaler</option>
    </select>
  </div>

  {/* Extra fields for Wholesaler */}
  {role === 'wholesaler' && (
    <>
      <input
        type="text"
        name="businessName"
        onChange={(e) => setBusinessName(e.target.value)}
        placeholder="Business Name"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="businessLicense"
        onChange={(e) => setBusinessLicense(e.target.value)}
        placeholder="Business License Number"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="taxId"
        onChange={(e) => setTaxId(e.target.value)}
        placeholder="Tax ID"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </>
  )}

  {/* Terms checkbox */}
  <div className="flex items-start">
    <input
      id="terms"
      name="terms"
      type="checkbox"
      className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      required
    />
    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
      By signing up, I have read and agree to Untitled UI's{' '}
      <a href="#" className="text-blue-600 font-medium">Terms</a> and{' '}
      <a href="#" className="text-blue-600 font-medium">Privacy Policy</a>
    </label>
  </div>

  {/* Error or success message */}
  {message && <p className="text-red-500 text-sm">{message}</p>}

  {/* Submit button */}
  <button
    type="submit"
    className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    disabled={isLoading}
  >
    {isLoading ? "Processing..." : "Continue"}
  </button>
</form>


      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Sign in
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

export default Register;



