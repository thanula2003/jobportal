//Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/api";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {

    /*
    ==========================
    ADMIN LOGIN
    ==========================
    */

    if (
      email === "admin@email.com" &&
      password === "1234"
    ) {

      navigate("/admin-dashboard");
      return;
    }

    /*
    ==========================
    COMPANY LOGIN
    ==========================
    */

    try {

      const res = await api.post(
        "/company/login",
        {
          email,
          password
        }
      );

      if (res.data.pending) {

        navigate("/pending-approval");
        return;
      }

      if (res.data.success) {

        navigate("/company-dashboard");

      } else {

        alert("Invalid Credentials");
      }

    } catch (error) {

      console.log(error);
      alert("Server Error");
    }
  };

  /*
  ==========================
  INTERNAL CSS
  ==========================
  */

  const styles = {

    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(to right,#0f172a,#1e293b)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px",
      fontFamily: "Arial"
    },

    container: {
      width: "100%",
      maxWidth: "1050px",
      display: "grid",
      gridTemplateColumns:
        "1fr 1fr",
      background: "white",
      borderRadius: "32px",
      overflow: "hidden",
      boxShadow:
        "0 25px 60px rgba(0,0,0,0.35)"
    },

    leftPanel: {
      background:
        "linear-gradient(to bottom right,#2563eb,#1d4ed8)",
      color: "white",
      padding: "60px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },

    logo: {
      fontSize: "42px",
      fontWeight: "900",
      color: "#facc15",
      marginBottom: "40px"
    },

    heading: {
      fontSize: "58px",
      fontWeight: "900",
      lineHeight: "1.1",
      marginBottom: "25px"
    },

    subtitle: {
      fontSize: "18px",
      lineHeight: "1.8",
      color: "#dbeafe"
    },

    rightPanel: {
      padding: "55px 45px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },

    formTitle: {
      fontSize: "46px",
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: "12px"
    },

    formSubtitle: {
      color: "#64748b",
      marginBottom: "35px",
      fontSize: "17px"
    },

    inputGroup: {
      marginBottom: "22px"
    },

    label: {
      display: "block",
      marginBottom: "10px",
      fontWeight: "bold",
      color: "#0f172a"
    },

    input: {
      width: "100%",
      padding: "18px",
      borderRadius: "16px",
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: "15px",
      boxSizing: "border-box"
    },

    loginBtn: {
      width: "100%",
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "18px",
      borderRadius: "18px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      boxShadow:
        "0 10px 30px rgba(37,99,235,0.35)"
    },

    bottomText: {
      marginTop: "28px",
      textAlign: "center",
      color: "#64748b"
    },

    signupLink: {
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

          <h1 style={styles.logo}>
            LankaJobsPortal
          </h1>

          <h2 style={styles.heading}>
            Welcome Back
          </h2>

          <p style={styles.subtitle}>

            Login to access your company dashboard,
            manage job postings, applications and
            recruitment activities through Sri Lanka’s
            modern hiring platform.

          </p>

        </div>

        {/* RIGHT PANEL */}

        <div style={styles.rightPanel}>

          <h1 style={styles.formTitle}>
            Login
          </h1>

          <p style={styles.formSubtitle}>
            Access your LankaJobsPortal account
          </p>

          {/* EMAIL */}

          <div style={styles.inputGroup}>

            <label style={styles.label}>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={styles.input}
            />

          </div>

          {/* PASSWORD */}

          <div style={styles.inputGroup}>

            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={styles.input}
            />

          </div>

          {/* BUTTON */}

          <button
            onClick={handleLogin}
            style={styles.loginBtn}
          >
            Login To Dashboard
          </button>

          {/* BOTTOM */}

          <p style={styles.bottomText}>

            Don’t have an account?{" "}

            <Link
              to="/signup"
              style={styles.signupLink}
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;