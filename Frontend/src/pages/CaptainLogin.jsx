import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { CaptainContext } from "../contexts/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const context = useContext(CaptainContext);
  const navigate = useNavigate();

  // ✅ Yup validation schema
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // ✅ Submission handler with validation
  async function submitHandler() {
    const captain = {
      email: email,
      password: password,
    };

    try {
      // Validate form inputs
      await loginSchema.validate(captain, { abortEarly: false });
      setErrors({}); // clear previous errors if any

      const response = await axios.post(`${import.meta.env.VITE_CAPTAIN_SERVICE_URL}/captains/login`, captain, {
        withCredentials: true,
      });

      const data = response.data;
      context.setAccessToken(data.accessToken);
      context.setEmail(captain.email);
      navigate("/captain/home");
    } catch (error) {
      // If validation errors, set them to show on screen
      if (error.name === "ValidationError") {
        const errorMessages = {};
        error.inner.forEach((err) => {
          errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages);
      } else {
        console.error("Login failed:", error);
        navigate("/error");
      }
    }
  }

  return (
      <div className="flex flex-col space-y-2 px-4 py-4 max-w-sm mx-auto">
          <h3 className="text-xl font-bold mb-2">Login</h3>

          <div>
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=" border-gray-500 border-2 rounded-md p-2"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" border-gray-500 border-2 rounded-md p-2"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
              type="submit"
              className="bg-black rounded-md text-white p-2 hover:bg-gray-800"
              onClick={submitHandler}
          >
              Login
          </button>

          <div className="text-sm mt-2">
              <span>
                  Don't have an account?{" "}
                  <Link to="/captain/signup" className="text-blue-600">
                      Create an account as captain
                  </Link>
              </span>
              <br />
              <span>
                  Want to book a ride?{" "}
                  <Link to="/user/login" className="text-blue-600">
                      Login as rider
                  </Link>
              </span>
          </div>
      </div>

  );
};

export default CaptainLogin;
