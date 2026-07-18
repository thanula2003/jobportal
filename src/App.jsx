import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home              from "./pages/Home";
import Login             from "./pages/Login";
import Signup            from "./pages/Signup";
import AdminDashboard    from "./pages/AdminDashboard";
import CompanyDashboard  from "./pages/CompanyDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import PendingApproval   from "./pages/PendingApproval";

/* ── Simple auth guard ── */
const ProtectedRoute = ({ element, allowedType }) => {
  const userType = localStorage.getItem("userType");
  if (userType !== allowedType) return <Navigate to="/login" replace />;
  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/pendingapproval" element={<PendingApproval />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedType="admin"
            />
          }
        />

        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute
              element={<CompanyDashboard />}
              allowedType="company"
            />
          }
        />

        <Route
          path="/jobseeker-dashboard"
          element={
            <ProtectedRoute
              element={<JobSeekerDashboard />}
              allowedType="jobseeker"
            />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;