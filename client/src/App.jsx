import React from "react";

import Header from "./components/Header"
import {Outlet} from 'react-router-dom'

import Home from "./pages/home";


const App = () => {
  return(
    <>
    <Header/>
    <Outlet/>
    <Home/>
    </>
  )
  
};

export default App;

