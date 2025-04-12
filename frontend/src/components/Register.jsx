import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";

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
    <section className="h-screen flex items-center justify-center">
      <div className="max-w-sm border shadow bg-white mx-auto p-8">
        <h2 className="text-2xl font-semibold pt-5">Register</h2>
        <form onSubmit={handleRegister} className="space-y-5 max-w-sm mx-auto pt-8">
          <input
            type="text"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />

          {/* Role Selection */}
          <div className="flex space-x-4 pt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="regular"
                checked={role === "regular"}
                onChange={() => setRole("regular")}
                className="mr-2"
              />
              Regular User
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="wholesaler"
                checked={role === "wholesaler"}
                onChange={() => setRole("wholesaler")}
                className="mr-2"
              />
              Wholesaler
            </label>
          </div>

          {/* Conditional Wholesaler Fields */}
          {role === "wholesaler" && (
            <>
              <input
                type="text"
                name="businessName"
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business Name"
                required
                className="w-full bg-gray-100 focus:outline-none px-5 py-3"
              />
              <input
                type="text"
                name="businessLicense"
                onChange={(e) => setBusinessLicense(e.target.value)}
                placeholder="Business License Number"
                required
                className="w-full bg-gray-100 focus:outline-none px-5 py-3"
              />
              <input
                type="text"
                name="taxId"
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="Tax ID"
                required
                className="w-full bg-gray-100 focus:outline-none px-5 py-3"
              />
            </>
          )}

          {message && <p className="text-red-500">{message}</p>}

          <button
            type="submit"
            className="w-full mt-5 bg-primary text-white hover:bg-indigo-500 font-medium py-3 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="my-5 italic text-sm text-center">
          Already have an Account?
          <Link to="/login" className="text-red-700 px-1 underline">
            Login
          </Link>{" "}
          Here.
        </p>
      </div>
    </section>
  );
};

export default Register;
