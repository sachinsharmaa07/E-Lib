import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SectionWrapper from "../components/SectionWrapper.jsx";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form.name, form.email);
    navigate("/dashboard");
  };

  return (
    <div className="page">
      <SectionWrapper>
        <div className="page-header">
          <h1 className="page-title">Create account</h1>
          <p className="page-subtitle">
            Set up your E-Library profile in a few seconds.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="fade-soft">
        <div className="auth-wrapper">
          <div className="auth-card">
            <h2 className="auth-title">Join the library</h2>
            <p className="auth-subtitle">
              Basic details only. No complex steps, just simple access.
            </p>

            <form className="form" onSubmit={handleSubmit}>
              <label>
                <span className="form-label-text">Full name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Sachin Sharma"
                />
              </label>

              <label>
                <span className="form-label-text">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span className="form-label-text">Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </label>

              <button className="btn" type="submit">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default Register;
