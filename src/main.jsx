import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Elements from './Elements.jsx'
import Error from './Error.jsx'
import Home from './Home.jsx'
import EvolvingBackground from "./EvolvingBackground.jsx";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/elements",
    element: <Elements />
  },
  {
    path: "/error",
    element: <Error />
  }
]);

React.DOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <App />
  </React.StrictMode>
);

