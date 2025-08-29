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
    status: "Active",
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
  const [qrModal, setQrModal] = useState({ open: false, data: null, showInfo: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewPage, setViewPage] = useState("products"); // products, dashboard, orders

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
      : products.filter((p) => p.createdBy === email || p.status.toLowerCase() === role.toLowerCase());

  const dashboardData = {
    farmer: [
      { title: "Crops Planted 🌾", value: 12 },
      { title: "Harvest Ready 🥦", value: 5 },
      { title: "Crops Sold 💰", value: 3 },
      { title: "Pending Harvest ⏳", value: 4 },
    ],
    distributor: [
      { title: "Stock Received 📦", value: 20 },
      { title: "Stock Distributed 🚚", value: 15 },
      { title: "In Transit 🛣️", value: 6 },
      { title: "Pending Supply 🕒", value: 2 },
    ],
    retailer: [
      { title: "Products in Stock 🏪", value: 10 },
      { title: "Products Sold 🛒", value: 7 },
      { title: "Awaiting Supply 📥", value: 3 },
      { title: "Out of Stock ❌", value: 1 },
    ],
    consumer: [
      { title: "Orders Placed 📑", value: 8 },
      { title: "Orders Received 📦", value: 5 },
      { title: "Orders Pending ⏳", value: 2 },
      { title: "Cancelled Orders ❌", value: 1 },
    ],
    admin: [
      { title: "Farmers Registered 🌾", value: 12 },
      { title: "Distributors Registered 🚛", value: 5 },
      { title: "Retailers Registered 🏬", value: 7 },
      { title: "Consumers Registered 👥", value: 20 },
    ],
  };

  const ordersData = {
    farmer: [
      { product: "Tomatoes", quantity: 50, status: "Delivered" },
      { product: "Wheat", quantity: 30, status: "Pending" },
    ],
    distributor: [
      { product: "Rice", quantity: 20, status: "In Transit" },
      { product: "Wheat", quantity: 15, status: "Delivered" },
    ],
    retailer: [
      { product: "Vegetables", quantity: 10, status: "Delivered" },
      { product: "Fruits", quantity: 25, status: "Pending" },
    ],
    consumer: [
      { product: "Rice", quantity: 5, status: "Received" },
      { product: "Tomatoes", quantity: 12, status: "Pending" },
    ],
    admin: [
      { product: "Tomatoes", quantity: 50, status: "Delivered" },
      { product: "Wheat", quantity: 30, status: "Pending" },
      { product: "Rice", quantity: 20, status: "In Transit" },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>{role} Dashboard</h1>
        <div className="user-info">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="side-menu">
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>Back</button>
          <ul>
            <li onClick={() => setViewPage("dashboard")}>Dashboard Status</li>
            <li onClick={() => setViewPage("orders")}>Orders</li>
            <li onClick={() => setViewPage("products")}>Products</li>
            <li>Settings</li>
            <li>Help Center</li>
            <li>About Us</li>
          </ul>
        </div>
      )}

      <main className="dashboard-main">
        {/* Search */}
        {viewPage === "products" && (
          <div className="search-container">
            <input type="text" placeholder="Search products..." />
          </div>
        )}

        {/* Dashboard Status */}
        {viewPage === "dashboard" && (
          <div className="dashboard-status">
            {dashboardData[role.toLowerCase()]?.map((d, i) => (
              <div className="status-card" key={i}>
                <h3>{d.title}</h3>
                <p>{d.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {viewPage === "orders" && (
          <div className="orders-page">
            <h2>Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersData[role.toLowerCase()]?.map((o, i) => (
                  <tr key={i}>
                    <td>{o.product}</td>
                    <td>{o.quantity}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Form */}
        {viewPage === "products" && (
          <>
            <button className="primary-btn" onClick={() => setShowForm(!showForm)}>+ Add Product</button>
            {showForm && (
              <section className="add-product">
                <h2>Add Product</h2>
                <form className="product-form" onSubmit={handleAddProduct}>
                  <label>Crop Name</label>
                  <input type="text" name="name" value={newProduct.name} onChange={handleChange} required />

                  <label>Crop Type</label>
                  <select name="cropType" value={newProduct.cropType} onChange={handleChange} required>
                    <option value="">Select Crop Type</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dals">Dals</option>
                    <option value="Other">Other</option>
                  </select>

                  <label>Soil Type</label>
                  <select name="soilType" value={newProduct.soilType} onChange={handleChange} required>
                    <option value="">Select Soil Type</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Silty">Silty</option>
                  </select>

                  <label>Status</label>
                  <select name="status" value={newProduct.status} onChange={handleChange} required>
                    <option value="Active">Active</option>
                    <option value="Harvested">Harvested</option>
                    <option value="Sold">Sold</option>
                  </select>

                  <label>Pesticides Used</label>
                  <input type="text" name="pesticides" value={newProduct.pesticides} onChange={handleChange} />

                  <label>Planted Date</label>
                  <input type="date" name="plantedDate" value={newProduct.plantedDate} onChange={handleChange} />

                  <label>Harvested Date</label>
                  <input type="date" name="harvestedDate" value={newProduct.harvestedDate} onChange={handleChange} />

                  <label>Use Before</label>
                  <input type="date" name="useBefore" value={newProduct.useBefore} onChange={handleChange} />

                  <label>Location</label>
                  <input type="text" name="location" value={newProduct.location} onChange={handleChange} />

                  <label>Image Upload</label>
                  <input type="file" name="imageFile" onChange={handleChange} />

                  <div className="form-buttons">
                    <button type="submit" className="primary-btn">Save</button>
                    <button type="button" className="primary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}

        {/* Product Table */}
        {viewPage === "products" && (
          <section className="product-list">
            <table>
              <thead>
                <tr>
                  <th>Crop Name</th>
                  <th>Crop Type</th>
                  <th>Soil Type</th>
                  <th>Status</th>
                  <th>Planted</th>
                  <th>Harvested</th>
                  <th>Use Before</th>
                  <th>Location</th>
                  <th>Image</th>
                  <th>QR</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.cropType}</td>
                    <td>{p.soilType}</td>
                    <td>{p.status}</td>
                    <td>{p.plantedDate}</td>
                    <td>{p.harvestedDate}</td>
                    <td>{p.useBefore}</td>
                    <td>{p.location}</td>
                    <td>{p.imageUrl && <img src={p.imageUrl} alt={p.name} className="table-img" />}</td>
                    <td>
                      <button className="primary-btn small-btn" onClick={() => setQrModal({ open: true, data: p, showInfo: false })}>
                        View QR
                      </button>
                    </td>
                    <td>
                      <button className="primary-btn small-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* QR Modal */}
        {qrModal.open && (
          <div className="qr-modal">
            <div className="qr-modal-content">
              <button className="close-btn" onClick={() => setQrModal({ open: false, data: null, showInfo: false })}>X</button>
              {qrModal.data && (
                <>
                  {!qrModal.showInfo ? (
                    <>
                      <QRCodeCanvas value={JSON.stringify(qrModal.data)} size={180} />
                      <button className="primary-btn" onClick={() => setQrModal((prev) => ({ ...prev, showInfo: true }))}>
                        Show Info
                      </button>
                    </>
                  ) : (
                    <div className="qr-info">
                      {qrModal.data.imageUrl && <img src={qrModal.data.imageUrl} alt={qrModal.data.name} className="table-img" />}
                      <pre>{JSON.stringify(qrModal.data, null, 2)}</pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
