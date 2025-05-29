import { useContext, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../contexts/UserContext";
import * as yup from 'yup';
//dummy commit
const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const context = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ Yup validation schema
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // ✅ Form submission handler
  async function submitHandler() {
    const user = { email, password };

    try {
      await schema.validate(user, { abortEarly: false }); // Validate all fields
      setErrors({}); // Clear previous errors

      const response = await axios.post(`${import.meta.env.VITE_USER_SERVICE_URL}/users/login`, user, { withCredentials: true });
      const data = response.data;

      context.setAccessToken(data.accessToken);
      context.setEmail(user.email);
      navigate('/user/home');

    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.log(err);
        navigate('/error');
      }
    }
  }

  return (
    <div className="flex flex-col space-y-3 max-w-sm mx-auto px-4 py-5">
      <h3 className="text-xl font-semibold">Login</h3>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-gray-500 border-2 rounded-md p-2"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-gray-500 border-2 rounded-md p-2"
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
          <Link to='/user/signup' className="text-blue-600">Create an account</Link>
        </span><br />
        <span>
          Want to drive for <i>TezzRides</i>?{" "}
          <Link to='/captain/login' className="text-blue-600">Login as captain</Link>
        </span>
      </div>
    </div>
  );
}

export default UserLogin;
