import { useState } from "react";
import api from "../services/api.js";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [pdf, setPdf] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const adminEmails = ["nitish@gmail.com", "hritik@gmail.com", "sachin@gmail.com"];
    if (adminEmails.includes(email) && password === "123") {
      setIsAdmin(true);
      fetchBooks();
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

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
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
            <p><strong>Status:</strong> {book.status}</p>
            {book.pdfFile && (
              <p>
                <a href={`http://localhost:4000${book.pdfFile}`} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                  �� View PDF
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
    </div>
  );
}
