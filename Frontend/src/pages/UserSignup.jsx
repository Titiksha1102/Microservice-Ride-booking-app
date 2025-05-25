import { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../contexts/UserContext";
import * as yup from 'yup';

const UserSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [warning, setWarning] = useState('');
  const context = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ Yup validation schema
  const schema = yup.object().shape({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  });

  async function submitHandler() {
    const user = { name, email, password };

    try {
      await schema.validate(user, { abortEarly: false });
      setErrors({});
      setWarning('');

      const response = await axios.post(`${VITE_USER_SERVICE_URL}/users/register`, user);

      if (response.status === 200 || response.status === 201) {
        navigate('/user/login');
      } else if (response.status === 409) {
        setWarning('Email already exists. Use another email or log in to recover your account.');
      } else {
        navigate('/error');
      }

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
    <div className="flex flex-col space-y-4 max-w-sm mx-auto px-4 py-5">
      <h3 className="text-xl font-semibold">Sign Up</h3>

      {warning && <p className="text-red-600 text-sm">{warning}</p>}

      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-gray-500 border-2 rounded-md p-2"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

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
        onClick={submitHandler}
        className="bg-black rounded-md text-white p-2 hover:bg-gray-800"
      >
        Sign Up
      </button>

      <span className="text-sm">
        Already have an account?{' '}
        <Link to='/user/login' className="text-blue-600">Login here</Link>
      </span>
    </div>
  );
};

export default UserSignup;
