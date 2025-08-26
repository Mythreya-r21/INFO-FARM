import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();

    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (!storedEmail || !storedPassword) {
      return alert("No registered user found. Please register first.");
    }

    if (formData.email === storedEmail && formData.password === storedPassword) {
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit" className="primary-btn">Login</button>
      </form>
      <p>Don’t have an account? <span className="link" onClick={() => navigate("/register")}>Register</span></p>
    </div>
  );
}
