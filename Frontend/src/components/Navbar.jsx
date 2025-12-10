import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSearch } from "../context/SearchContext.jsx";
import logo from "../assets/elib-logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const { search, setSearch } = useSearch();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Logo" className="large-logo" />
      </Link>

      <input
        className="navbar-search"
        placeholder="Search by title / author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="navbar-right">
        <Link to="/books" className="navbar-link">Books</Link>
        <Link to="/admin" className="navbar-link">Admin</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/borrowed" className="navbar-link">My Books</Link>
            <span className="navbar-user">{user.name}</span>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
