import { Link } from "react-router-dom";

const PendingApproval = () => {

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
      background:
        "linear-gradient(to bottom right,#2563eb,#1d4ed8)",
      color: "white",
      padding: "60px 50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },

    logo: {
      fontSize: "42px",
      fontWeight: "900",
      color: "#facc15",
      marginBottom: "30px"
    },

    heading: {
      fontSize: "48px",
      fontWeight: "900",
      lineHeight: "1.2",
      marginBottom: "25px"
    },

    subtitle: {
      fontSize: "17px",
      lineHeight: "1.8",
      color: "#dbeafe"
    },

    steps: {
      marginTop: "40px",
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    },

    step: {
      display: "flex",
      alignItems: "center",
      gap: "16px"
    },

    stepDot: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "900",
      fontSize: "15px",
      flexShrink: 0,
      color: "#bfdbfe"
    },

    stepDotDone: {
      background: "#facc15",
      color: "#0f172a"
    },

    stepDotActive: {
      background: "white",
      color: "#2563eb"
    },

    stepText: {
      fontSize: "15px",
      color: "#bfdbfe"
    },

    stepTextActive: {
      color: "white",
      fontWeight: "bold"
    },

    rightPanel: {
      padding: "55px 50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    },

    iconWrap: {
      width: "110px",
      height: "110px",
      background: "#eff6ff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "28px",
      border: "3px solid #bfdbfe"
    },

    title: {
      fontSize: "40px",
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: "14px"
    },

    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "#fefce8",
      border: "1.5px solid #fde68a",
      color: "#92400e",
      fontSize: "13px",
      fontWeight: "bold",
      padding: "8px 18px",
      borderRadius: "999px",
      marginBottom: "22px"
    },

    description: {
      fontSize: "16px",
      color: "#64748b",
      lineHeight: "1.75",
      marginBottom: "28px",
      maxWidth: "340px"
    },

    infoBox: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "20px 24px",
      marginBottom: "28px",
      width: "100%",
      textAlign: "left"
    },

    infoRow: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "10px 0",
      borderBottom: "1px solid #f1f5f9"
    },

    infoRowLast: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "10px 0"
    },

    infoIcon: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      background: "#eff6ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    },

    infoLabel: {
      display: "block",
      fontSize: "13px",
      color: "#0f172a",
      fontWeight: "bold",
      marginBottom: "2px"
    },

    infoValue: {
      fontSize: "12px",
      color: "#94a3b8"
    },

    loginBtn: {
      width: "100%",
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "17px",
      borderRadius: "16px",
      fontSize: "17px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 10px 30px rgba(37,99,235,0.3)",
      textDecoration: "none",
      display: "block"
    },

    supportBtn: {
      width: "100%",
      background: "transparent",
      color: "#64748b",
      border: "1px solid #e2e8f0",
      padding: "14px",
      borderRadius: "16px",
      fontSize: "15px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "12px"
    }

  };

  const PulseStyle = () => (
    <span style={{
      display: "inline-block",
      width: "9px",
      height: "9px",
      borderRadius: "50%",
      background: "#f59e0b",
      animation: "pulse 1.5s infinite"
    }} />
  );

  return (

    <div style={styles.page}>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

      <div style={styles.container}>

        {/* ── LEFT PANEL ── */}

        <div style={styles.leftPanel}>

          <h1 style={styles.logo}>
            LankaJobsPortal
          </h1>

          <h2 style={styles.heading}>
            Almost There!
          </h2>

          <p style={styles.subtitle}>
            Your registration has been submitted. Our team
            reviews every company application carefully to
            maintain platform quality.
          </p>

          {/* PROGRESS STEPS */}

          <div style={styles.steps}>

            <div style={styles.step}>
              <div style={{
                ...styles.stepDot,
                ...styles.stepDotDone
              }}>
                ✓
              </div>
              <span style={styles.stepText}>
                Account created
              </span>
            </div>

            <div style={styles.step}>
              <div style={{
                ...styles.stepDot,
                ...styles.stepDotActive
              }}>
                2
              </div>
              <span style={{
                ...styles.stepText,
                ...styles.stepTextActive
              }}>
                Admin review in progress
              </span>
            </div>

            <div style={styles.step}>
              <div style={styles.stepDot}>
                3
              </div>
              <span style={styles.stepText}>
                Account approved — post jobs!
              </span>
            </div>

          </div>

        </div>

        {/* ── RIGHT PANEL ── */}

        <div style={styles.rightPanel}>

          {/* CLOCK ICON */}

          <div style={styles.iconWrap}>
            <svg
              width="54"
              height="54"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <h1 style={styles.title}>
            Registration Pending
          </h1>

          {/* STATUS PILL */}

          <div style={styles.statusPill}>
            <PulseStyle />
            Under Review
          </div>

          <p style={styles.description}>
            Your company registration is currently being reviewed
            by our administrators. You'll receive access once
            it's approved.
          </p>

          {/* INFO BOX */}

          <div style={styles.infoBox}>

            <div style={styles.infoRow}>
              <div style={styles.infoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <span style={styles.infoLabel}>Review time</span>
                <span style={styles.infoValue}>
                  Usually within 1–2 business days
                </span>
              </div>
            </div>

            {/* <div style={styles.infoRow}>
              <div style={styles.infoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <span style={styles.infoLabel}>Notification</span>
                <span style={styles.infoValue}>
                  You'll be notified via your registered email
                </span>
              </div>
            </div> */}

            {/* <div style={styles.infoRowLast}>
              <div style={styles.infoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.015 1.19 2 2 0 012 .001h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
              </div>
              <div>
                <span style={styles.infoLabel}>Need help?</span>
                <span style={styles.infoValue}>
                  Contact support@lankajobsportal.lk
                </span>
              </div>
            </div> */}

          </div>

          {/* BUTTONS */}

          <Link to="/login" style={{ width: "100%" }}>
            <button style={styles.loginBtn}>
              Back To Login
            </button>
          </Link>

          {/* <button style={styles.supportBtn}>
            Contact Support
          </button> */}

        </div>

      </div>

    </div>
  );
};

export default PendingApproval;