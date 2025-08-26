import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      return alert("Please fill all fields.");
    }

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    localStorage.setItem("userName", formData.name);
    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("userPassword", formData.password);
    localStorage.setItem("userRole", formData.role);

    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="farmer">Farmer</option>
          <option value="distributor">Distributor</option>
          <option value="retailer">Retailer</option>
          <option value="consumer">Consumer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="primary-btn">Register</button>
      </form>
      <p>Already registered? <span className="link" onClick={() => navigate("/login")}>Login</span></p>
    </div>
  );
}
