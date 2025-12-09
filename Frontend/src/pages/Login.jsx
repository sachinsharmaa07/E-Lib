import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (location.state?.message) {
    showToast(location.state.message);
    location.state = null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(email);
      showToast("Logged in successfully");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}

        <button disabled={loading} className="btn">
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
