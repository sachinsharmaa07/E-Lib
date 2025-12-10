import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Dashboard from "./pages/Dashboard";
import BorrowedBooks from "./pages/BorrowedBooks";
import AdminPanel from "./pages/AdminPanel";
import Footer from "./pages/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrowed"
            element={
              <ProtectedRoute>
                <BorrowedBooks />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
