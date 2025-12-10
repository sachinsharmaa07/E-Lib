import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Dashboard</h1>
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
