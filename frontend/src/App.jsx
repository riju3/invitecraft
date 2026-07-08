import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateInvite from "./pages/CreateInvite.jsx";
import EditInvite from "./pages/EditInvite.jsx";
import PublicInvite from "./pages/PublicInvite.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Public marketing/landing page */}
      <Route path="/" element={<Landing />} />

      {/* Auth pages - for the couple creating an invite */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Couple-only pages - require login */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateInvite />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditInvite />
          </ProtectedRoute>
        }
      />

      {/* PUBLIC - guests open this from the shared link / QR code. NO login required. */}
      <Route path="/invite/:slug" element={<PublicInvite />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
