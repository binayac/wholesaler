import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegisterUserMutation, useResendVerificationMutation } from "../redux/features/auth/authApi";
import womanImg from '../assets/woman.png';
import TestimonialSlider from "./TestimonialSlider";

const Register = () => {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [taxId, setTaxId] = useState("");
  const [errors, setErrors] = useState({}); // New state for field-specific errors

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return 'Username is required.';
    if (username.includes(' ')) return 'Username cannot contain spaces.';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, underscores, or hyphens.';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required.';
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      return 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character (!@#$%^&*).';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
      setErrors((prev) => ({ ...prev, username: validateUsername(value) }));
    } else if (name === 'email') {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: value ? '' : 'Email is required.' }));
    } else if (name === 'password') {
      setPassword(value);
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    } else if (name === 'businessName') {
      setBusinessName(value);
    } else if (name === 'businessLicense') {
      setBusinessLicense(value);
    } else if (name === 'taxId') {
      setTaxId(value);
    } else if (name === 'role') {
      setRole(value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    // Client-side validation
    const usernameError = validateUsername(username);
    const emailError = !email ? 'Email is required.' : '';
    const passwordError = validatePassword(password);
    const roleError = !role ? 'Please select a role.' : '';
    const wholesalerErrors = role === 'wholesaler' ? {
      businessName: !businessName ? 'Business Name is required.' : '',
      businessLicense: !businessLicense ? 'Business License is required.' : '',
      taxId: !taxId ? 'Tax ID is required.' : ''
    } : {};

    if (usernameError || emailError || passwordError || roleError || Object.values(wholesalerErrors).some((err) => err)) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        role: roleError,
        ...wholesalerErrors
      });
      return;
    }

    const data = {
      username,
      email,
      password,
      role: role === "customer" ? "user" : role,
    };

    if (role === "wholesaler") {
      data.businessName = businessName;
      data.businessLicense = businessLicense;
      data.taxId = taxId;
    }

    try {
      const response = await registerUser(data).unwrap();
      setMessage(response.message || "User registration successful! Please check your email to verify your account.");
    } catch (error) {
      setMessage(error.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await resendVerification({ email }).unwrap();
      setMessage(response.message || "Verification email resent successfully.");
    } catch (error) {
      setMessage(error.data?.message || "Error resending verification email.");
    }
  };

  return (
    <div className="flex h-full md:h-screen flex-col-reverse md:flex-row">
      {/* Left side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="nav__logo mb-6">
            <Link to="/">Wholesale<span>.</span></Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-600 mb-8">Start your wholesale journey — it's simple and seamless.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" className="absolute right-3 top-3 text-gray-400">
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Role selection */}
            <div>
              <select
                name="role"
                onChange={handleChange}
                value={role}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="customer">Customer</option>
                <option value="wholesaler">Wholesaler</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Extra fields for Wholesaler */}
            {role === "wholesaler" && (
              <>
                <div>
                  <input
                    type="text"
                    name="businessName"
                    value={businessName}
                    onChange={handleChange}
                    placeholder="Business Name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="businessLicense"
                    value={businessLicense}
                    onChange={handleChange}
                    placeholder="Business License Number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.businessLicense && <p className="text-red-500 text-sm mt-1">{errors.businessLicense}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="taxId"
                    value={taxId}
                    onChange={handleChange}
                    placeholder="Tax ID"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.taxId && <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>}
                </div>
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
            {message && (
              <div className="text-sm">
                <p className={message.includes('successful') ? 'text-green-500' : 'text-red-500'}>
                  {message}
                </p>
                {message.includes('verify') && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="mt-2 text-blue-600 hover:underline"
                    disabled={isResending}
                  >
                    {isResending ? 'Resending...' : 'Resend Verification Email'}
                  </button>
                )}
                {message.includes('Email already in use') && (
                  <p className="mt-2">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Log in
                    </Link>
                  </p>
                )}
                {message.includes('Username already in use') && (
                  <p className="mt-2">
                    Username taken. Please try a different username or{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                      log in
                    </Link>
                    .
                  </p>
                )}
              </div>
            )}

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