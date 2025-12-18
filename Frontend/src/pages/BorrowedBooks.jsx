import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function BorrowedBooks() {
  const { user } = useAuth();
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchBorrowedBooks();
  }, [user]);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await api.get(`/borrow/${user._id}`);
      setBorrowed(response.data);
    } catch (err) {
      setError("Failed to load borrowed books");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await api.post("/borrow/return", { userId: user._id, bookId });
      alert("Book returned successfully!");
      fetchBorrowedBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Error returning book");
    }
  };

  if (!user) {
    return <div style={{ padding: "20px" }}>Please login to view borrowed books</div>;
  }

  if (loading) return <div style={{ padding: "20px" }}>Loading borrowed books...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>My Borrowed Books (Approved)</h1>

      {borrowed.length === 0 ? (
        <p>You haven't borrowed any approved books yet. Check your requests in the Books section.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {borrowed.map((item) => (
            <div key={item._id} style={{ border: "2px solid #4caf50", padding: "15px", borderRadius: "8px", backgroundColor: "#f1f8f4" }}>
              {item.book?.thumbnail && (
                <img
                  src={item.book.thumbnail.startsWith("http") ? item.book.thumbnail : `http://localhost:4000${item.book.thumbnail}`}
                  alt={item.book.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }}
                />
              )}

              <h3>{item.book?.title || "Unknown Book"}</h3>
              <p><strong>Author:</strong> {item.book?.author || "Unknown"}</p>
              <p><strong>Category:</strong> {item.book?.category || "Unknown"}</p>

              <p style={{ fontSize: "12px", color: "#666" }}>
                <strong>Approved on:</strong> {new Date(item.approvedAt).toLocaleDateString()}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {item.book?.pdfFile && (
                  <a
                    href={`http://localhost:4000${item.book.pdfFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, padding: "8px", backgroundColor: "#4caf50", color: "white", textDecoration: "none", textAlign: "center", borderRadius: "4px", fontSize: "14px" }}
                  >
                    Download PDF
                  </a>
                )}

                <button
                  onClick={() => handleReturn(item.bookId)}
                  style={{ flex: 1, padding: "8px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
