import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hello from "./pages/hello";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

import "./App.css";  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
