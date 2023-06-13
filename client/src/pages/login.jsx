import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Background from "../assets/logo.png"
function Login() {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prevInputs) => ({ ...prevInputs, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3000/login', inputs)
      .then((response) => {
        const authtoken = response.data.token;
        localStorage.setItem('authtoken', authtoken);
        const storedtoken = localStorage.getItem('authtoken');
        if (storedtoken) {
          navigate('/');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setError('Invalid email or password');
        } else {
          setError('An error occurred. Please try again later.');
        }
      });
  };

  return (
    <>

      <div className='flex h-[80vh] items-center justify-center'>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>

            <h2 className="text-center text-2xl font-bold leading-9 mt-3 h-[30px]">
              Sign in to your account
            </h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email"
                  value={inputs.email}
                  onChange={handleChange}
                  className="block w-full text-center rounded-md outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={inputs.password}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none border-0 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              {error && <h1 className="text-red-700 text-sm text-center">{error}</h1>}
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
            <div className="text-sm space-x-2 flex felx-row items-center justify-center">
              <h1>Don't have an account?</h1>
              <Link to="/register">
                <p className="font-semibold text-lg text-indigo-500 hover:text-indigo-600">
                  Register
                </p>
              </Link>
            </div>
          </form>
        </div>
        {/* Logo */}
        <div style={{
          width: "50%",
          height: "80vh",
          // backgroundColor : "pink",
          marginTop: "60px",
          backgroundImage: `url(${Background})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "contain"
        }}>

        </div>
      </div>
    </>
  );
}

export default Login;