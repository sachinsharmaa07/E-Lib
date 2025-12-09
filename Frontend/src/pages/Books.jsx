import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSearch } from "../context/SearchContext.jsx";

function Books() {
  const { user } = useAuth();
  const { search } = useSearch();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBooks([
        {
          _id: "1",
          title: "Introduction to Algorithms",
          author: "CLRS",
          category: "CS",
          status: "available",
          thumbnail: "https://via.placeholder.com/300x420",
        },
        {
          _id: "2",
          title: "Database Systems",
          author: "Korth",
          category: "DBMS",
          status: "issued",
          thumbnail: "https://via.placeholder.com/300x420",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="page-title">Available Books</h1>

      {loading && (
        <div className="books-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      )}

      {!loading && filteredBooks.length === 0 && (
        <div className="empty-state">
          <p>No books match your search.</p>
          <p>Try a different title or author.</p>
        </div>
      )}

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div key={book._id} className="book-card">
            <img
              src={book.thumbnail}
              alt={book.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "12px",
                transition: "transform 200ms ease",
              }}
            />

            <span className={`status ${book.status}`}>
              {book.status}
            </span>

            <h3 className="book-title">{book.title}</h3>
            <p className="book-meta">by {book.author}</p>

            <Link to={`/books/${book._id}`} className="btn btn-outline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
