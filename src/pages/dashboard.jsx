// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole") || "Farmer";
  const email = localStorage.getItem("userEmail");

  const initialProductState = {
    name: "",
    cropType: "",
    soilType: "",
    status: role.toLowerCase(),
    pesticides: "",
    plantedDate: "",
    harvestedDate: "",
    useBefore: "",
    location: "",
    imageFile: null,
  };

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [qrModal, setQrModal] = useState({ open: false, data: null });
  const [viewPage, setViewPage] = useState("products"); // "products" or "orders" etc.

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setNewProduct((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name) return alert("Enter product name");

    let imageUrl = "";
    if (newProduct.imageFile) {
      imageUrl = URL.createObjectURL(newProduct.imageFile);
    }

    const product = {
      ...newProduct,
      id: Date.now(),
      createdBy: email,
      imageUrl,
    };

    const productToSave = { ...product };
    delete productToSave.imageFile; // remove File object before saving

    setProducts((prev) => [...prev, product]);
    setNewProduct(initialProductState);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const visibleProducts =
    role.toLowerCase() === "admin"
      ? products
      : products.filter((p) => p.createdBy === email || p.status === role.toLowerCase());

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>{role} Dashboard</h1>
        <div className="user-info">
          <button className="menu-btn" onClick={() => setViewPage("menu")}>
            ☰
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Three-line menu */}
      {viewPage === "menu" && (
        <div className="side-menu">
          <button onClick={() => setViewPage("products")}>Products</button>
          <button onClick={() => setViewPage("orders")}>Orders</button>
          <button onClick={() => setViewPage("settings")}>Settings</button>
          <button onClick={() => setViewPage("help")}>Help Center</button>
        </div>
      )}

      {/* Add Product Button */}
      {viewPage === "products" && ["farmer", "admin", "distributor", "retailer"].includes(role.toLowerCase()) && (
        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          + Add Product
        </button>
      )}

      {/* Product Form */}
      {showForm && viewPage === "products" && (
        <section className="add-product">
          <h2>Add Product</h2>
          <form className="product-form" onSubmit={handleAddProduct}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleChange}
              required
            />
            <select name="cropType" value={newProduct.cropType} onChange={handleChange} required>
              <option value="">Select Crop Type</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruit">Fruit</option>
              <option value="grains">Grains</option>
              <option value="dals">Dals</option>
              <option value="other">Other</option>
            </select>
            <select name="soilType" value={newProduct.soilType} onChange={handleChange} required>
              <option value="">Select Soil Type</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="silty">Silty</option>
            </select>
            <input type="text" name="pesticides" placeholder="Pesticides Used" value={newProduct.pesticides} onChange={handleChange} />
            <input type="date" name="plantedDate" placeholder="Planted Date" value={newProduct.plantedDate} onChange={handleChange} />
            <input type="date" name="harvestedDate" placeholder="Harvested Date" value={newProduct.harvestedDate} onChange={handleChange} />
            <input type="date" name="useBefore" placeholder="Use Before" value={newProduct.useBefore} onChange={handleChange} />
            <input type="text" name="location" placeholder="Location" value={newProduct.location} onChange={handleChange} />
            <input type="file" name="imageFile" onChange={handleChange} />
            <div className="form-buttons">
              <button type="submit" className="primary-btn small-btn">Save</button>
              <button type="button" className="primary-btn small-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      {/* Product Table */}
      {viewPage === "products" && (
        <section className="product-list">
          <h2>Products</h2>
          <input type="text" placeholder="🔍 Search" className="search-bar" />
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Crop Name</th>
                <th>Soil Name</th>
                <th>Pesticides</th>
                <th>Planted Date</th>
                <th>Harvested Date</th>
                <th>Use Before</th>
                <th>Location</th>
                <th>QR</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />}</td>
                  <td>{p.name}</td>
                  <td>{p.soilType}</td>
                  <td>{p.pesticides}</td>
                  <td>{p.plantedDate}</td>
                  <td>{p.harvestedDate}</td>
                  <td>{p.useBefore}</td>
                  <td>{p.location}</td>
                  <td>
                    <div className="qr-code" onClick={() => setQrModal({ open: true, data: p })}>
                      <QRCodeCanvas value={JSON.stringify(p)} size={80} />
                    </div>
                  </td>
                  <td>
                    {["farmer", "admin", "distributor", "retailer"].includes(role.toLowerCase()) && (
                      <button className="primary-btn small-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Orders */}
      {viewPage === "orders" && (
        <section className="orders-page">
          <h2>Orders</h2>
          <ul>
            <li>Order ID: 1001 — Product: Tomatoes — Quantity: 50 — Status: Delivered</li>
            <li>Order ID: 1002 — Product: Wheat — Quantity: 30 — Status: Received</li>
            <li>Order ID: 1003 — Product: Rice — Quantity: 20 — Status: Pending</li>
          </ul>
        </section>
      )}

      {/* QR Modal */}
      {qrModal.open && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <h3>Product Info</h3>
            <button className="close-btn" onClick={() => setQrModal({ open: false, data: null })}>X</button>
            {qrModal.data && (
              <div>
                {qrModal.data.imageUrl && (
                  <img src={qrModal.data.imageUrl} alt={qrModal.data.name} style={{ width: "150px", borderRadius: "6px" }} />
                )}
                <pre>{JSON.stringify(qrModal.data, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
