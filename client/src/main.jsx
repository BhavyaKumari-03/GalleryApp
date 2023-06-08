import React from 'react'
import * as ReactDOM from "react-dom/client";
import App from './App.jsx'
import './index.css'
import Login from './pages/login.jsx';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Post from './pages/Post.jsx';
import Register from './pages/Register.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Post",
    element: <Post />,
  },
  {
    path:"/Register",
    element:<Register/>,
  }
 
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
