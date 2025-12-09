import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section className="hero-card">
        <div>
          <h1 className="hero-title">
            Digital <span className="hero-highlight">E-Library System</span>
          </h1>

          <p className="hero-text">
            A modern digital library platform that allows students and faculty
            to search, access, and manage academic resources anytime, from any
            device.
          </p>

          <div className="hero-actions">
            <Link to="/books" className="btn">
              Explore Books
            </Link>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-side">
          <p>
            Designed for academic institutions to replace traditional libraries
            with a fast, accessible, and centralized digital solution.
          </p>
        </div>
      </section>

      {/* OVERVIEW SECTION */}
      <section className="section-card">
        <h2 className="page-title">Library Overview</h2>
        <p className="page-subtitle">
          A centralized platform for managing digital learning resources
        </p>

        <ul>
          <li>Access e-books, journals, and reference materials online</li>
          <li>Search books by title, author, or subject in real time</li>
          <li>View borrowed books and track availability</li>
          <li>Secure role-based access for students and faculty</li>
        </ul>
      </section>

      {/* FEATURES SECTION */}
      <section className="section-card">
        <h2 className="page-title">Key Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h4>Smart Search</h4>
            <p>
              Quickly find books using title or author with instant results.
            </p>
          </div>

          <div className="feature-card">
            <h4>Digital Borrowing</h4>
            <p>
              Track issued books and their status directly from your dashboard.
            </p>
          </div>

          <div className="feature-card">
            <h4>Remote Access</h4>
            <p>
              Access the library anytime without visiting the physical location.
            </p>
          </div>

          <div className="feature-card">
            <h4>User Friendly</h4>
            <p>
              Clean interface designed for ease of use and fast navigation.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-card">
        <h2 className="page-title">How It Works</h2>

        <ol className="steps">
          <li>
            <strong>Login / Register</strong> – Create or access your account.
          </li>
          <li>
            <strong>Search & Browse</strong> – Explore available digital books.
          </li>
          <li>
            <strong>Borrow & Manage</strong> – View issued books and availability.
          </li>
        </ol>
      </section>

      {/* TECH STACK */}
      <section className="section-card">
        <h2 className="page-title">Technology Stack</h2>
        <p className="page-subtitle">
          Built using modern full-stack web technologies
        </p>

        <ul>
          <li><strong>Frontend:</strong> React.js (Vite)</li>
          <li><strong>Backend:</strong> Node.js & Express.js</li>
          <li><strong>Database:</strong> MongoDB</li>
          <li><strong>Version Control:</strong> Git & GitHub</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
