//Signup.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";

const Signup = () => {

  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("company");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    br: "",
    website: "", 
    contact: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {

    /* ── Basic validation ── */
    if (accountType=='jobseeker'&& (!formData.name || !formData.contact || !formData.email || !formData.password)) {
      alert("Please fill in all required fields");
      return;
    }

    if (accountType=='company'&&(!formData.address || !formData.br || !formData.website)) {
      alert("Please fill in company address, BR number, and website");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {

      /* ── COMPANY REGISTRATION ── */
      if (accountType === "company") {

        if (!formData.address || !formData.br) {
          alert("Please fill in company address and BR number");
          setLoading(false);
          return;
        }

        const res = await api.post("/company/register", {
          name:      formData.name,
          address:   formData.address,
          br_number: formData.br,
          website:   formData.website,
          contact:   formData.contact,
          email:     formData.email,
          password:  formData.password
        });

        if (res.data.success) {
          navigate("/pendingapproval");
        } else {
          alert(res.data.message || "Registration failed");
        }
      }

      /* ── JOB SEEKER REGISTRATION ── */
      else {

        const res = await axios.post("http://localhost:5000/jobseeker/register", {
          name:     formData.name,
          contact:  formData.contact,
          email:    formData.email,
          password: formData.password
        });

        if (res.data.success) {
          alert("Account created! You can now login.");
          navigate("/login");
        } else {
          alert(res.data.message || "Registration failed");
        }
      }

    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Server error. Please try again.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ── STYLES ── */
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to right,#0f172a,#1e293b)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 20px",
      fontFamily: "Arial"
    },
    container: {
      width: "100%",
      maxWidth: "1000px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "white",
      borderRadius: "30px",
      overflow: "hidden",
      boxShadow: "0 25px 60px rgba(0,0,0,0.35)"
    },
    leftPanel: {
      background: "linear-gradient(to bottom right,#2563eb,#1d4ed8)",
      color: "white",
      padding: "60px 50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    logo: {
      fontSize: "42px",
      fontWeight: "900",
      marginBottom: "30px",
      color: "#facc15"
    },
    heading: {
      fontSize: "52px",
      fontWeight: "900",
      lineHeight: "1.2",
      marginBottom: "25px"
    },
    subtitle: {
      fontSize: "18px",
      lineHeight: "1.8",
      color: "#dbeafe"
    },
    rightPanel: {
      padding: "50px 45px",
      overflowY: "auto",
      maxHeight: "100vh"
    },
    formTitle: {
      fontSize: "42px",
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: "10px"
    },
    formSubtitle: {
      color: "#64748b",
      marginBottom: "35px"
    },
    selector: {
      width: "100%",
      padding: "15px",
      borderRadius: "14px",
      border: "1px solid #cbd5e1",
      marginBottom: "25px",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box"
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px"
    },
    input: {
      padding: "16px",
      borderRadius: "14px",
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: "15px",
      width: "100%",
      boxSizing: "border-box"
    },
    fullWidth: {
      gridColumn: "1 / -1"
    },
    signupBtn: {
      width: "100%",
      background: loading ? "#93c5fd" : "#2563eb",
      color: "white",
      border: "none",
      padding: "18px",
      borderRadius: "16px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: loading ? "not-allowed" : "pointer",
      marginTop: "25px",
      boxShadow: "0 10px 30px rgba(37,99,235,0.3)"
    },
    bottomText: {
      textAlign: "center",
      marginTop: "25px",
      color: "#64748b"
    },
    loginLink: {
      color: "#2563eb",
      fontWeight: "bold",
      textDecoration: "none"
    }
  };

  return (

    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          <h1 style={styles.logo}>LankaJobsPortal</h1>
          <h2 style={styles.heading}>Start Your Career Journey Today</h2>
          <p style={styles.subtitle}>
            Join Sri Lanka's modern job platform. Connect companies with talented
            professionals and discover exciting career opportunities.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.rightPanel}>

          <h1 style={styles.formTitle}>Create Account</h1>
          <p style={styles.formSubtitle}>Register your company or job seeker profile</p>

          {/* ACCOUNT TYPE SELECTOR */}
          <select
            value={accountType}
            onChange={(e) => {
              setAccountType(e.target.value);
              setFormData({ name: "", address: "", br: "", website: "", contact: "", email: "", password: "", confirmPassword: "" });
            }}
            style={styles.selector}
          >
            <option value="company">Company</option>
            <option value="jobseeker">Job Seeker</option>
          </select>

          <div style={styles.formGrid}>

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder={accountType === "company" ? "Company Name" : "Full Name"}
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />

            {/* CONTACT */}
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              style={styles.input}
            />

            {/* COMPANY ONLY FIELDS */}
            {accountType === "company" && (
              <input
                type="text"
                name="address"
                placeholder="Company Address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
              />
            )}

            {accountType === "company" && (
              <input
                type="text"
                name="br"
                placeholder="Business Registration Number"
                value={formData.br}
                onChange={handleChange}
                style={styles.input}
              />
            )}

            {accountType === "company" && (
              <input
                type="url"
                name="website"
                placeholder="Company Website (https://...)"
                value={formData.website}
                onChange={handleChange}
                style={styles.input}
              />
            )}

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.input, ...styles.fullWidth }}
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />

            {/* CONFIRM PASSWORD */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-type Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />

          </div>

          <button
            onClick={handleSignup}
            style={styles.signupBtn}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p style={styles.bottomText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.loginLink}>Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;