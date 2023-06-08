import React from "react";
//import axios from "axios";
import Header from "./components/Header"
import {Outlet} from 'react-router-dom'


const App = () => {
  return(
    <>
    <Header/>
    <Outlet/>
    </>
  )
  
};

export default App;

