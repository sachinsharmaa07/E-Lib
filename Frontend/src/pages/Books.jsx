import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function Books() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
    if (user) fetchBorrowedBooks();
  }, [user]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch (err) {
      setError("Failed to load books");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await api.get(`/borrow/${user._id}`);
      setBorrowedBooks(response.data.map(b => b.bookId));
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
    }
  };

  const handleBorrow = async (bookId) => {
    if (!user) {
      alert("Please login to borrow books");
      return;
    }
    try {
      await api.post("/borrow", { userId: user._id, bookId });
      alert("Borrow request submitted! Waiting for admin approval.");
      fetchBooks();
      fetchBorrowedBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Error borrowing book");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading books...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Books</h1>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {books.map((book) => {
            const isBorrowed = borrowedBooks.includes(book._id);
            const hasAvailable = (book.availableQuantity || 0) > 0;

            return (
              <div key={book._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", position: "relative" }}>
                <span style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor: hasAvailable ? "#4caf50" : "#ff9800",
                  color: "white"
                }}>
                  {hasAvailable ? "Available" : "Issued"}
                </span>

                {book.thumbnail && (
                  <img
                    src={book.thumbnail.startsWith("http") ? book.thumbnail : `http://localhost:4000${book.thumbnail}`}
                    alt={book.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }}
                  />
                )}
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Category:</strong> {book.category}</p>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  <strong>Available Copies:</strong> {book.availableQuantity || 0} / {book.quantity || 1}
                </p>

                {isBorrowed && <p style={{ color: "#ff9800", fontWeight: "bold" }}>✓ You borrowed this</p>}

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  {hasAvailable && !isBorrowed && (
                    <button
                      onClick={() => handleBorrow(book._id)}
                      style={{ flex: 1, padding: "8px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Request to Borrow
                    </button>
                  )}

                  {!hasAvailable && (
                    <button
                      disabled
                      style={{ flex: 1, padding: "8px", backgroundColor: "#ccc", color: "white", border: "none", borderRadius: "4px", cursor: "not-allowed" }}
                    >
                      Out of Stock
                    </button>
                  )}

                  {book.pdfFile && (
                    <a
                      href={`http://localhost:4000${book.pdfFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ flex: 1, padding: "8px", backgroundColor: "#4caf50", color: "white", textDecoration: "none", textAlign: "center", borderRadius: "4px" }}
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
