import { Link } from "react-router-dom";

const Home = () => {

  const styles = {

    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(to right,#0f172a,#1e293b)",
      fontFamily: "Arial, sans-serif",
      color: "white"
    },

    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "25px 60px",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    },

    logo: {
      fontSize: "34px",
      fontWeight: "bold",
      color: "#facc15"
    },

    navButtons: {
      display: "flex",
      gap: "15px"
    },

    loginBtn: {
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "14px 28px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
      transition: "0.3s"
    },

    signupBtn: {
      background: "#facc15",
      color: "#0f172a",
      border: "none",
      padding: "14px 28px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px"
    },

    hero: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "80px 60px",
      flexWrap: "wrap",
      gap: "50px"
    },

    left: {
      flex: 1,
      minWidth: "320px"
    },

    heading: {
      fontSize: "72px",
      fontWeight: "900",
      lineHeight: "1.1",
      marginBottom: "25px"
    },

    highlight: {
      color: "#facc15"
    },

    subtitle: {
      fontSize: "22px",
      color: "#cbd5e1",
      lineHeight: "1.7",
      marginBottom: "40px",
      maxWidth: "700px"
    },

    heroButtons: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap"
    },

    primaryBtn: {
      background: "#2563eb",
      border: "none",
      color: "white",
      padding: "18px 35px",
      borderRadius: "16px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "18px",
      boxShadow: "0 10px 30px rgba(37,99,235,0.4)"
    },

    secondaryBtn: {
      background: "white",
      border: "none",
      color: "#0f172a",
      padding: "18px 35px",
      borderRadius: "16px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "18px"
    },

    right: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      minWidth: "320px"
    },

    card: {
      width: "100%",
      maxWidth: "500px",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
      borderRadius: "30px",
      padding: "40px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
    },

    cardTitle: {
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "30px"
    },

    jobCard: {
      background: "rgba(255,255,255,0.06)",
      padding: "20px",
      borderRadius: "20px",
      marginBottom: "20px"
    },

    jobTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "10px"
    },

    company: {
      color: "#facc15",
      marginBottom: "10px"
    },

    salary: {
      color: "#cbd5e1"
    },

    footer: {
      textAlign: "center",
      padding: "25px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      color: "#94a3b8"
    }

  };

  return (

    <div style={styles.page}>

      {/* NAVBAR */}

      <nav style={styles.navbar}>

        <h1 style={styles.logo}>
          LankaJobsPortal
        </h1>

        <div style={styles.navButtons}>

          <Link to="/login">

            <button style={styles.loginBtn}>
              Login
            </button>

          </Link>

          <Link to="/signup">

            <button style={styles.signupBtn}>
              Sign Up
            </button>

          </Link>

        </div>

      </nav>

      {/* HERO */}

      <section style={styles.hero}>

        {/* LEFT */}

        <div style={styles.left}>

          <h1 style={styles.heading}>

            Find Your <span style={styles.highlight}>
              Dream Career
            </span> In Sri Lanka

          </h1>

          <p style={styles.subtitle}>

            LankaJobsPortal connects top companies
            with talented professionals. Discover
            thousands of opportunities in IT,
            Finance, Marketing, Engineering and more.

          </p>

          <div style={styles.heroButtons}>

            <Link to="/signup">

              <button style={styles.primaryBtn}>
                Create Account
              </button>

            </Link>

            <Link to="/login">

              <button style={styles.secondaryBtn}>
                Browse Jobs
              </button>

            </Link>

          </div>

        </div>

        {/* RIGHT */}

        <div style={styles.right}>

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              Featured Jobs
            </h2>

            <div style={styles.jobCard}>

              <div style={styles.jobTitle}>
                Senior React Developer
              </div>

              <div style={styles.company}>
                ABC Technologies
              </div>

              <div style={styles.salary}>
                Colombo • Rs. 250,000
              </div>

            </div>

            <div style={styles.jobCard}>

              <div style={styles.jobTitle}>
                UI/UX Designer
              </div>

              <div style={styles.company}>
                Pixel Lanka
              </div>

              <div style={styles.salary}>
                Kandy • Rs. 180,000
              </div>

            </div>

            <div style={styles.jobCard}>

              <div style={styles.jobTitle}>
                Marketing Executive
              </div>

              <div style={styles.company}>
                Vision Holdings
              </div>

              <div style={styles.salary}>
                Galle • Rs. 120,000
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer style={styles.footer}>

        © 2026 LankaJobsPortal. All Rights Reserved.

      </footer>

    </div>
  );
};

export default Home;