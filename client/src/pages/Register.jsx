import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    f_name: '',
    l_name: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prevInputs) => ({ ...prevInputs, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/users', inputs);
      alert("registered successfull")
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('An error occurred while processing your request.');
      }
    }
  };
  

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 lg:px-8">
        <div className="bg-white shadow-lg mt-20 py-5 lg:px-0 px-3 rounded-lg w-full lg:w-2/4">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
            Sign up to create an account
          </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex flex-row justify-between">
                <div>
                  <label className="block text-sm font-medium leading-6">First name</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="f_name"
                      name="f_name"
                      required
                      placeholder="Firstname"
                      className="block w-full text-center rounded-md outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={inputs.f_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6">Last name</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="l_name"
                      name="l_name"
                      required
                      placeholder="Lastname"
                      className="block w-full text-center rounded-md outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={inputs.l_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password"  className="block text-sm font-medium leading-6">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    pattern="[a-zA-Z0-9@#$]+"
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
                <button onClick={handleSubmit}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
              <div className="text-sm space-x-2 flex felx-row items-center justify-center">
                <h1>Have an account?</h1>
                <Link to="/login">
                  <p className="font-bold text-lg text-indigo-500 hover:text-indigo-600">Login</p>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;