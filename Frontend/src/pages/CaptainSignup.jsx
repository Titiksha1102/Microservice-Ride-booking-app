import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { CaptainContext } from "../contexts/CaptainContext";

const CaptainSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [warning, setWarning] = useState("");

  const context = useContext(CaptainContext);
  const navigate = useNavigate();

  const captainSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    vehicleNumber: Yup.string()
      .matches(
        /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
        "Vehicle Number must be in the format XX00XX0000"
      )
      .required("Vehicle number is required"),
    licenseNumber: Yup.string()
      .matches(/^[A-Z]{2}\d{2}\d{4}\d{7}$/
, "License number must be in the format SSRRYYYYNNNNNNN")
      .required(""),
  });

  async function submitHandler() {
    const captain = {
      name,
      email,
      password,
      vehicleNumber,
      licenseNumber,
    };

    try {
      // Clear previous errors
      setErrors({});
      setWarning("");

      // Validate using Yup
      await captainSchema.validate(captain, { abortEarly: false });

      // Send request if validation passes
      const response = await axios.post(
        "http://localhost:4002/captains/register",
        captain
      );

      if (response.status === 200 || response.status === 201) {
        return navigate("/captain/login");
      }

      if (response.status === 409) {
        setWarning(
          'Email already exists. Use another email or <a href="/captain/login" class="text-blue-600 underline">login</a> to recover your account.'
        );
        return navigate("/captain/signup");
      }

      return navigate("/error");
    } catch (err) {
      if (err.name === "ValidationError") {
        // Convert Yup errors into a field-wise object
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error(err);
        navigate("/error");
      }
    }
  }

  return (
    <div>
      <h3>Sign Up</h3>
      {warning && <p className="text-red-600" dangerouslySetInnerHTML={{ __html: warning }} />}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-gray-500 border-2 rounded-md p-2 m-2"
      />
      {errors.name && <p className="text-red-600 ml-2">{errors.name}</p>}

      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-gray-500 border-2 rounded-md p-2 m-2"
      />
      {errors.email && <p className="text-red-600 ml-2">{errors.email}</p>}

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-gray-500 border-2 rounded-md p-2 m-2"
      />
      {errors.password && <p className="text-red-600 ml-2">{errors.password}</p>}

      <br />

      <input
        type="text"
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        className="border-gray-500 border-2 rounded-md p-2 m-2"
      />
      {errors.vehicleNumber && <p className="text-red-600 ml-2">{errors.vehicleNumber}</p>}

      <br />

      <input
        type="text"
        placeholder="Driving License Number"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value)}
        className="border-gray-500 border-2 rounded-md p-2 m-2"
      />
      {errors.licenseNumber && <p className="text-red-600 ml-2">{errors.licenseNumber}</p>}

      <br />

      <input
        type="file"
        placeholder="Driving License"
        onChange={(e) => {}}
        className="border-gray-500 border-2 rounded-md p-2 m-2"
      />
      <br />

      <button
        type="submit"
        onClick={submitHandler}
        className="bg-black rounded-md text-white p-2"
      >
        Sign Up
      </button>
      <br />

      <span>
        Already have an account?{" "}
        <Link to="/captain/login" className="text-blue-600">
          Login here
        </Link>
      </span>
    </div>
  );
};

export default CaptainSignup;
