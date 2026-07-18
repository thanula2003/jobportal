import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyDashboard = () => {

  const navigate = useNavigate();

  /*
  ===================================
  AUTH GUARD
  ===================================
  */

  const company = JSON.parse(
    localStorage.getItem("company") || "null"
  );

  useEffect(() => {
    if (!company) {
      navigate("/login");
      return;
    }
    fetchJobs();
  }, []);

  /*
  ===================================
  STATES
  ===================================
  */

  const [activeTab, setActiveTab] =
    useState("jobs");

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [posting, setPosting] =
    useState(false);

  const [jobForm, setJobForm] =
    useState({
      title: "",
      apply_email: "",
      salary: "",
      location: "",
      positions: "",
      description: ""
    });

  /*
  ===================================
  FETCH JOBS
  ===================================
  */

  const fetchJobs = async () => {

    setLoading(true);

    try {

      const res = await axios.get(
        `http://localhost:5000/company/jobs/${company.id}`
      );

      setJobs(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  /*
  ===================================
  POST JOB
  ===================================
  */

  const handlePostJob = async () => {

    if (
      !jobForm.title ||
      !jobForm.salary ||
      !jobForm.location ||
      !jobForm.description
    ) {
      alert(
        "Please fill in all required fields"
      );
      return;
    }

    setPosting(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/company/post-job",
        {
          company_id: company.id,
          company_name: company.name,
          title: jobForm.title,
          apply_email:
            jobForm.apply_email ||
            company.email,
          salary: jobForm.salary,
          location: jobForm.location,
          positions:
            Number(jobForm.positions) || 1,
          description: jobForm.description
        }
      );

      if (res.data.success) {
        alert("Job posted successfully!");
        setJobForm({
          title: "",
          apply_email: "",
          salary: "",
          location: "",
          positions: "",
          description: ""
        });
        setActiveTab("jobs");
        fetchJobs();
      }

    } catch (error) {

      console.error(error);
      alert("Error posting job. Try again.");

    } finally {

      setPosting(false);
    }
  };

  /*
  ===================================
  DELETE JOB
  ===================================
  */

  const handleDeleteJob = async (id) => {

    if (!window.confirm("Delete this job?"))
      return;

    try {

      await axios.delete(
        `http://localhost:5000/company/delete-job/${id}`
      );

      fetchJobs();

    } catch (error) {

      console.error(error);
      alert("Error deleting job");
    }
  };

  /*
  ===================================
  LOGOUT
  ===================================
  */

  const handleLogout = () => {

    localStorage.removeItem("company");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  /*
  ===================================
  INPUT HANDLER
  ===================================
  */

  const handleChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value
    });
  };

  if (!company) return null;

  /*
  ===================================
  INTERNAL CSS
  ===================================
  */

  const styles = {

    page: {
      minHeight: "100vh",
      background: "#f1f5f9",
      fontFamily: "Arial"
    },

    navbar: {
      background: "#0f172a",
      padding: "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      flexWrap: "wrap",
      gap: "20px"
    },

    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: "20px"
    },

    logo: {
      fontSize: "32px",
      fontWeight: "900",
      color: "#facc15"
    },

    companyBadge: {
      background: "rgba(255,255,255,0.1)",
      color: "#cbd5e1",
      padding: "6px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "bold"
    },

    logoutBtn: {
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "14px 24px",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer"
    },

    container: {
      padding: "30px"
    },

    heading: {
      fontSize: "38px",
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: "30px"
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(240px,1fr))",
      gap: "20px",
      marginBottom: "35px"
    },

    statCard: {
      background: "white",
      padding: "30px",
      borderRadius: "22px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
    },

    statTitle: {
      color: "#64748b",
      marginBottom: "15px",
      fontWeight: "bold"
    },

    statValue: {
      fontSize: "42px",
      fontWeight: "900",
      color: "#2563eb"
    },

    statValueGreen: {
      fontSize: "42px",
      fontWeight: "900",
      color: "#22c55e"
    },

    statValueYellow: {
      fontSize: "42px",
      fontWeight: "900",
      color: "#f59e0b",
      textTransform: "capitalize"
    },

    tabBar: {
      display: "flex",
      gap: "10px",
      marginBottom: "30px",
      flexWrap: "wrap"
    },

    tab: {
      padding: "12px 24px",
      borderRadius: "14px",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "15px"
    },

    tabActive: {
      background: "#0f172a",
      color: "white"
    },

    tabInactive: {
      background: "white",
      color: "#475569",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
    },

    section: {
      background: "white",
      padding: "30px",
      borderRadius: "25px",
      marginBottom: "30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
    },

    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      flexWrap: "wrap",
      gap: "15px"
    },

    sectionTitle: {
      fontSize: "28px",
      fontWeight: "900",
      color: "#0f172a"
    },

    postBtn: {
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "14px 22px",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "15px"
    },

    grid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(320px,1fr))",
      gap: "20px"
    },

    card: {
      border: "1px solid #e2e8f0",
      borderRadius: "18px",
      padding: "20px"
    },

    cardTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#0f172a",
      marginBottom: "12px"
    },

    text: {
      color: "#475569",
      marginBottom: "8px",
      wordBreak: "break-word"
    },

    deleteBtn: {
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "15px"
    },

    empty: {
      color: "#64748b",
      textAlign: "center",
      padding: "40px 0",
      fontSize: "18px"
    },

    formGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(280px,1fr))",
      gap: "20px",
      marginBottom: "20px"
    },

    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },

    label: {
      fontWeight: "bold",
      color: "#0f172a",
      fontSize: "14px"
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

    textarea: {
      padding: "16px",
      borderRadius: "14px",
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: "15px",
      width: "100%",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "140px"
    },

    formActions: {
      display: "flex",
      gap: "15px",
      marginTop: "10px"
    },

    submitBtn: {
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "16px 32px",
      borderRadius: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "16px",
      boxShadow: "0 8px 20px rgba(37,99,235,0.3)"
    },

    submitBtnDisabled: {
      background: "#93c5fd",
      color: "white",
      border: "none",
      padding: "16px 32px",
      borderRadius: "14px",
      fontWeight: "bold",
      cursor: "not-allowed",
      fontSize: "16px"
    },

    cancelBtn: {
      background: "#f1f5f9",
      color: "#475569",
      border: "none",
      padding: "16px 32px",
      borderRadius: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "16px"
    },

    profileGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(280px,1fr))",
      gap: "16px"
    },

    profileItem: {
      background: "#f8fafc",
      padding: "20px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0"
    },

    profileLabel: {
      fontSize: "13px",
      color: "#64748b",
      fontWeight: "bold",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },

    profileValue: {
      fontSize: "17px",
      fontWeight: "bold",
      color: "#0f172a",
      textTransform: "capitalize",
      wordBreak: "break-word"
    },

    statusApproved: {
      display: "inline-block",
      background: "#dcfce7",
      color: "#15803d",
      padding: "4px 14px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "bold"
    },

    statusPending: {
      display: "inline-block",
      background: "#fef9c3",
      color: "#a16207",
      padding: "4px 14px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "bold"
    }

  };

  /*
  ===================================
  RENDER
  ===================================
  */

  return (

    <div style={styles.page}>

      {/* NAVBAR */}

      <nav style={styles.navbar}>

        <div style={styles.navLeft}>

          <h1 style={styles.logo}>
            LankaJobsPortal
          </h1>

          <span style={styles.companyBadge}>
            {company.name}
          </span>

        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
        >
          Logout
        </button>

      </nav>

      {/* MAIN */}

      <div style={styles.container}>

        <h1 style={styles.heading}>
          Company Dashboard
        </h1>

        {/* STATS */}

        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>
              Active Jobs
            </div>
            <div style={styles.statValue}>
              {jobs.length}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>
              Total Positions
            </div>
            <div style={styles.statValueGreen}>
              {jobs.reduce(
                (sum, j) => sum + (j.positions || 0),
                0
              )}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>
              Account Status
            </div>
            <div style={styles.statValueYellow}>
              {company.status}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>
              Member Since
            </div>
            <div
              style={{
                ...styles.statValue,
                fontSize: "22px",
                paddingTop: "8px"
              }}
            >
              {new Date(
                company.created_at
              ).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </div>
          </div>

        </div>

        {/* TAB BAR */}

        <div style={styles.tabBar}>

          {[
            { key: "jobs", label: "My Job Posts" },
            { key: "post", label: "Post New Job" },
            { key: "profile", label: "Company Profile" }
          ].map((t) => (

            <button
              key={t.key}
              style={{
                ...styles.tab,
                ...(activeTab === t.key
                  ? styles.tabActive
                  : styles.tabInactive)
              }}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>

          ))}

        </div>

        {/* ========================
            TAB: MY JOB POSTS
        ======================== */}

        {activeTab === "jobs" && (

          <div style={styles.section}>

            <div style={styles.sectionHeader}>

              <h2 style={styles.sectionTitle}>
                My Job Posts
              </h2>

              <button
                style={styles.postBtn}
                onClick={() =>
                  setActiveTab("post")
                }
              >
                + Post New Job
              </button>

            </div>

            {loading ? (

              <p style={styles.empty}>
                Loading jobs...
              </p>

            ) : jobs.length === 0 ? (

              <p style={styles.empty}>
                No jobs posted yet.
              </p>

            ) : (

              <div style={styles.grid}>

                {jobs.map((job) => (

                  <div
                    key={job.id}
                    style={styles.card}
                  >

                    <h3 style={styles.cardTitle}>
                      {job.title}
                    </h3>

                    <p style={styles.text}>
                      📍 {job.location}
                    </p>

                    <p style={styles.text}>
                      💰 {job.salary}
                    </p>

                    <p style={styles.text}>
                      👥 {job.positions} position
                      {job.positions !== 1
                        ? "s"
                        : ""}
                    </p>

                    <p style={styles.text}>
                      📧 {job.apply_email}
                    </p>

                    <p style={styles.text}>
                      🗓{" "}
                      {new Date(
                        job.created_at
                      ).toLocaleDateString()}
                    </p>

                    <p
                      style={{
                        ...styles.text,
                        marginTop: "12px",
                        fontSize: "14px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {job.description}
                    </p>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        handleDeleteJob(job.id)
                      }
                    >
                      Delete Job
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}

        {/* ========================
            TAB: POST NEW JOB
        ======================== */}

        {activeTab === "post" && (

          <div style={styles.section}>

            <h2
              style={{
                ...styles.sectionTitle,
                marginBottom: "28px"
              }}
            >
              Post a New Job
            </h2>

            <div style={styles.formGrid}>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Job Title *
                </label>
                <input
                  name="title"
                  placeholder="e.g. Senior React Developer"
                  value={jobForm.title}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Apply Email
                </label>
                <input
                  name="apply_email"
                  type="email"
                  placeholder={company.email}
                  value={jobForm.apply_email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Salary *
                </label>
                <input
                  name="salary"
                  placeholder="e.g. Rs. 150,000"
                  value={jobForm.salary}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Location *
                </label>
                <input
                  name="location"
                  placeholder="e.g. Colombo"
                  value={jobForm.location}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Open Positions
                </label>
                <input
                  name="positions"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={jobForm.positions}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Job Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={jobForm.description}
                onChange={handleChange}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formActions}>

              <button
                onClick={handlePostJob}
                disabled={posting}
                style={
                  posting
                    ? styles.submitBtnDisabled
                    : styles.submitBtn
                }
              >
                {posting
                  ? "Posting..."
                  : "Post Job"}
              </button>

              <button
                onClick={() =>
                  setActiveTab("jobs")
                }
                style={styles.cancelBtn}
              >
                Cancel
              </button>

            </div>

          </div>

        )}

        {/* ========================
            TAB: COMPANY PROFILE
        ======================== */}

        {activeTab === "profile" && (

          <div style={styles.section}>

            <h2
              style={{
                ...styles.sectionTitle,
                marginBottom: "28px"
              }}
            >
              Company Profile
            </h2>

            <div style={styles.profileGrid}>

              {[
                {
                  label: "Company Name",
                  value: company.name
                },
                {
                  label: "Email Address",
                  value: company.email,
                  noCapitalize: true
                },
                {
                  label: "Contact Number",
                  value: company.contact
                },
                {
                  label: "Address",
                  value: company.address
                },
                {
                  label: "BR Number",
                  value: company.br_number
                },
                {
                  label: "Member Since",
                  value: new Date(
                    company.created_at
                  ).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }),
                  noCapitalize: true
                }
              ].map(({ label, value, noCapitalize }) => (

                <div
                  key={label}
                  style={styles.profileItem}
                >

                  <p style={styles.profileLabel}>
                    {label}
                  </p>

                  <p
                    style={{
                      ...styles.profileValue,
                      textTransform: noCapitalize
                        ? "none"
                        : "capitalize"
                    }}
                  >
                    {value}
                  </p>

                </div>

              ))}

              {/* STATUS — SPECIAL */}

              <div style={styles.profileItem}>

                <p style={styles.profileLabel}>
                  Account Status
                </p>

                <span
                  style={
                    company.status === "approved"
                      ? styles.statusApproved
                      : styles.statusPending
                  }
                >
                  {company.status}
                </span>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default CompanyDashboard;