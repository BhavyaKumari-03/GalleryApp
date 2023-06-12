import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { GrGallery } from 'react-icons/gr';
import { BiSearch } from 'react-icons/bi';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user login status

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the authtoken exists in local storage
    const authtoken = localStorage.getItem('authtoken');
    if (authtoken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear the authtoken from local storage and update login status
    localStorage.removeItem('authtoken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="w-full px-4 py-2 bg-white shadow-sm">
      <div className="flex flex-row justify-between items-center">
        <div>
          <Link to="/">
            <div className="flex items-center space-x-1">
              <GrGallery className="text-indigo-600" />
              <h1 className="font-bold text-xl">Image Gallery</h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn && !isLoginPage && !isRegisterPage ? (
            <Link to="/profile">
              <FiUser className="text-black text-2xl" />
            </Link>
          ) : !isLoginPage && !isRegisterPage ? (
            <Link to="/login">
              <h1 className="font-bold text-lg">Login</h1>
            </Link>
          ) : null}
          {isLoggedIn ? (
            <>
              <button onClick={handleLogout}>
                <h1 className="font-bold text-lg">Logout</h1>
              </button>
              <div className="flex items-center">
                <Link to="/post">
                  <h1 className="font-bold text-lg">Post</h1>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Header;
