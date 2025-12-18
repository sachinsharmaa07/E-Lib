import { useState, useEffect } from "react";
import api from "../services/api.js";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("books");
  const [editingQuantity, setEditingQuantity] = useState({});

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [thumbnail, setThumbnail] = useState(null);
  const [pdf, setPdf] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const adminEmails = ["nitish@gmail.com", "hritik@gmail.com", "sachin@gmail.com"];
    if (adminEmails.includes(email) && password === "123") {
      setIsAdmin(true);
      fetchBooks();
      fetchPendingRequests();
      setError("");
    } else {
      setError("Invalid admin credentials");
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      setError("Error fetching books");
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get("/borrow/admin/pending", {
        headers: { email, password }
      });
      setPendingRequests(res.data);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("quantity", quantity);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (pdf) formData.append("pdf", pdf);

      await api.post("/books", formData, {
        headers: {
          email,
          password
        }
      });

      setTitle("");
      setAuthor("");
      setCategory("");
      setQuantity("1");
      setThumbnail(null);
      setPdf(null);
      fetchBooks();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}`, {
        headers: { email, password }
      });
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting book");
    }
  };

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    try {
      await api.put(`/books/${bookId}/quantity`, { quantity: newQuantity }, {
        headers: { email, password }
      });
      fetchBooks();
      setEditingQuantity({});
    } catch (err) {
      setError(err.response?.data?.message || "Error updating quantity");
    }
  };

  const handleApproveBorrow = async (borrowId) => {
    try {
      await api.put(`/borrow/admin/approve/${borrowId}`, {}, {
        headers: { email, password }
      });
      setError("");
      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Error approving borrow request");
    }
  };

  const handleRejectBorrow = async (borrowId, reason = "") => {
    try {
      await api.put(`/borrow/admin/reject/${borrowId}`, { reason }, {
        headers: { email, password }
      });
      setError("");
      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Error rejecting borrow request");
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
        <h2>Admin Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <button type="submit" className="btn">Admin Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>
      <button onClick={() => setIsAdmin(false)} className="btn" style={{ marginBottom: "20px" }}>Logout</button>

      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #ddd" }}>
        <button
          onClick={() => { setActiveTab("books"); fetchBooks(); }}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "books" ? "#2196F3" : "#f0f0f0",
            color: activeTab === "books" ? "white" : "black",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px 4px 0 0"
          }}
        >
          📚 Manage Books
        </button>
        <button
          onClick={() => { setActiveTab("requests"); fetchPendingRequests(); }}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "requests" ? "#2196F3" : "#f0f0f0",
            color: activeTab === "requests" ? "white" : "black",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px 4px 0 0",
            position: "relative"
          }}
        >
          📋 Borrow Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
        </button>
      </div>

      {/* Books Tab */}
      {activeTab === "books" && (
        <>
          <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
            <h3>Add New Book</h3>
            <form onSubmit={handleAddBook} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="number"
                placeholder="Number of Copies"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <label>Book Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <label>Book PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdf(e.target.files[0])}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <button type="submit" disabled={loading} className="btn">
                {loading ? "Adding..." : "Add Book"}
              </button>
            </form>
          </div>

          <h3>All Books</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {books.map((book) => (
              <div key={book._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
                {book.thumbnail && (
                  <img
                    src={`http://localhost:4000${book.thumbnail}`}
                    alt={book.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }}
                  />
                )}
                <h4>{book.title}</h4>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Category:</strong> {book.category}</p>

                {/* Quantity Section */}
                <div style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}>
                  {editingQuantity[book._id] ? (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="number"
                        min="1"
                        defaultValue={book.quantity}
                        id={`qty-${book._id}`}
                        style={{ flex: 1, padding: "5px", border: "1px solid #ccc" }}
                      />
                      <button
                        onClick={() => {
                          const newQty = document.getElementById(`qty-${book._id}`).value;
                          handleUpdateQuantity(book._id, newQty);
                        }}
                        style={{ padding: "5px 10px", backgroundColor: "#4caf50", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingQuantity({})}
                        style={{ padding: "5px 10px", backgroundColor: "#ff9800", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span><strong>Total:</strong> {book.quantity} | <strong>Available:</strong> {book.availableQuantity || 0}</span>
                      <button
                        onClick={() => setEditingQuantity({ ...editingQuantity, [book._id]: true })}
                        style={{ padding: "5px 10px", backgroundColor: "#2196F3", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <p><strong>Status:</strong> {book.status}</p>
                {book.pdfFile && (
                  <p>
                    <a href={`http://localhost:4000${book.pdfFile}`} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                      📄 View PDF
                    </a>
                  </p>
                )}
                <p style={{ fontSize: "12px", color: "#999" }}>
                  <strong>Uploaded by:</strong> {book.uploadedBy || "unknown"}<br />
                  <strong>Date:</strong> {book.uploadedAt ? new Date(book.uploadedAt).toLocaleDateString() : "N/A"}
                </p>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="btn"
                  style={{ marginTop: "10px", width: "100%", backgroundColor: "#d32f2f", color: "white" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div>
          <h3>Pending Borrow Requests</h3>
          {pendingRequests.length === 0 ? (
            <p style={{ color: "#666" }}>No pending requests</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
              {pendingRequests.map((request) => (
                <div key={request._id} style={{ border: "2px solid #ffb74d", padding: "15px", borderRadius: "8px", backgroundColor: "#fffbf0" }}>
                  {request.book?.thumbnail && (
                    <img
                      src={`http://localhost:4000${request.book.thumbnail}`}
                      alt={request.book?.title}
                      style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }}
                    />
                  )}
                  <h4>{request.book?.title || "Unknown Book"}</h4>
                  <p><strong>Author:</strong> {request.book?.author || "Unknown"}</p>
                  <p><strong>Category:</strong> {request.book?.category || "Unknown"}</p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    <strong>Available Copies:</strong> {request.book?.availableQuantity || 0} / {request.book?.quantity || 1}
                  </p>
                  <p style={{ fontSize: "12px", color: "#999" }}>
                    <strong>Request Date:</strong> {new Date(request.borrowedAt).toLocaleDateString()}
                  </p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button
                      onClick={() => handleApproveBorrow(request._id)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontWeight: "bold"
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Reason for rejection (optional):");
                        if (reason !== null) handleRejectBorrow(request._id, reason);
                      }}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#d32f2f",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontWeight: "bold"
                      }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
