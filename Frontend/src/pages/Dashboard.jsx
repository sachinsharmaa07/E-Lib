import SectionWrapper from "../components/SectionWrapper.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <SectionWrapper>
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome, {user?.name || "user"}. This is your simple overview.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="fade-soft">
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-label">Borrowed books</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Reservations</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Account email</div>
            <div className="stat-value">{user?.email || "-"}</div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default Dashboard;
