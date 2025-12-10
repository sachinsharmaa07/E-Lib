import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" disabled={loading} className="btn" style={{ padding: "10px" }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Already have account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
