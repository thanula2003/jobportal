import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const AdminDashboard = () => {

  const navigate = useNavigate();

  /*
  ===================================
  STATES
  ===================================
  */

  const [pendingCompanies, setPendingCompanies] =
    useState([]);

  const [companies, setCompanies] =
    useState([]);

  const [jobs, setJobs] =
    useState([]);

  const [jobSeekers, setJobSeekers] =
    useState([]);

  /*
  ===================================
  FETCH DATA
  ===================================
  */

  useEffect(() => {

    fetchPendingCompanies();
    fetchCompanies();
    fetchJobs();
    fetchJobSeekers();

  }, []);

  /*
  ===================================
  FETCH PENDING COMPANIES
  ===================================
  */

  const fetchPendingCompanies = async () => {

    try {

      const res = await api.get(
        "/admin/pending-companies"
      );

      setPendingCompanies(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  /*
  ===================================
  FETCH ALL COMPANIES
  ===================================
  */

  const fetchCompanies = async () => {

    try {

      const res = await api.get(
        "/admin/all-companies"
      );

      setCompanies(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  /*
  ===================================
  FETCH JOBS
  ===================================
  */

  const fetchJobs = async () => {

    try {

      const res = await api.get(
        "/admin/all-jobs"
      );

      setJobs(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  /*
  ===================================
  FETCH JOB SEEKERS
  ===================================
  */

  const fetchJobSeekers = async () => {

    try {

      const res = await api.get(
        "/admin/jobseekers"
      );

      setJobSeekers(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  /*
  ===================================
  APPROVE COMPANY
  ===================================
  */

  const approveCompany = async (id) => {

    try {

      await api.put(
        `/admin/approve-company/${id}`
      );

      alert("Company Approved");

      fetchPendingCompanies();
      fetchCompanies();

    } catch (error) {

      console.log(error);
    }
  };

  /*
  ===================================
  DELETE COMPANY
  ===================================
  */

  const deleteCompany = async (id) => {

    try {

      await api.delete(
        `/admin/delete-company/${id}`
      );

      fetchCompanies();

    } catch (error) {

      console.log(error);
    }
  };

  /*
  ===================================
  DELETE JOB
  ===================================
  */

  const deleteJob = async (id) => {

    try {

      await api.delete(
        `/admin/delete-job/${id}`
      );

      fetchJobs();

    } catch (error) {

      console.log(error);
    }
  };

  /*
  ===================================
  LOGOUT
  ===================================
  */

  const handleLogout = () => {

    navigate("/login");
  };

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

    logo: {
      fontSize: "32px",
      fontWeight: "900",
      color: "#facc15"
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
      boxShadow:
        "0 10px 30px rgba(0,0,0,0.08)"
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

    section: {
      background: "white",
      padding: "30px",
      borderRadius: "25px",
      marginBottom: "30px",
      boxShadow:
        "0 10px 30px rgba(0,0,0,0.06)"
    },

    sectionTitle: {
      fontSize: "28px",
      fontWeight: "900",
      marginBottom: "25px",
      color: "#0f172a"
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

    approveBtn: {
      background: "#22c55e",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "15px",
      marginRight: "10px"
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
      color: "#64748b"
    }

  };

  return (

    <div style={styles.page}>

      {/* NAVBAR */}

      <nav style={styles.navbar}>

        <h1 style={styles.logo}>
          LankaJobsPortal
        </h1>

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
          Admin Dashboard
        </h1>

        {/* STATS */}

        <div style={styles.statsGrid}>

          <div style={styles.statCard}>

            <div style={styles.statTitle}>
              Pending Companies
            </div>

            <div style={styles.statValue}>
              {pendingCompanies.length}
            </div>

          </div>

          <div style={styles.statCard}>

            <div style={styles.statTitle}>
              Registered Companies
            </div>

            <div style={styles.statValue}>
              {companies.length}
            </div>

          </div>

          <div style={styles.statCard}>

            <div style={styles.statTitle}>
              Posted Jobs
            </div>

            <div style={styles.statValue}>
              {jobs.length}
            </div>

          </div>

          <div style={styles.statCard}>

            <div style={styles.statTitle}>
              Job Seekers
            </div>

            <div style={styles.statValue}>
              {jobSeekers.length}
            </div>

          </div>

        </div>

        {/* PENDING COMPANIES */}

        <div style={styles.section}>

          <h2 style={styles.sectionTitle}>
            Pending Companies
          </h2>

          {
            pendingCompanies.length === 0 ? (

              <p style={styles.empty}>
                No Pending Companies
              </p>

            ) : (

              <div style={styles.grid}>

                {
                  pendingCompanies.map((company) => (

                    <div
                      key={company.id}
                      style={styles.card}
                    >

                      <h3 style={styles.cardTitle}>
                        {company.name}
                      </h3>

                      <p style={styles.text}>
                        Email: {company.email}
                      </p>

                      <p style={styles.text}>
                        Contact: {company.contact}
                      </p>

                      <p style={styles.text}>
                        Address: {company.address}
                      </p>

                      <p style={styles.text}>
                        BR Number: {company.br_number}
                      </p>

                      <button
                        style={styles.approveBtn}
                        onClick={() =>
                          approveCompany(company.id)
                        }
                      >
                        Approve
                      </button>

                    </div>
                  ))
                }

              </div>
            )
          }

        </div>

        {/* REGISTERED COMPANIES */}

        <div style={styles.section}>

          <h2 style={styles.sectionTitle}>
            Registered Companies
          </h2>

          <div style={styles.grid}>

            {
              companies.map((company) => (

                <div
                  key={company.id}
                  style={styles.card}
                >

                  <h3 style={styles.cardTitle}>
                    {company.name}
                  </h3>

                  <p style={styles.text}>
                    Email: {company.email}
                  </p>

                  <p style={styles.text}>
                    Contact: {company.contact}
                  </p>

                  <p style={styles.text}>
                    Status: {company.status}
                  </p>

                  <button
                    style={styles.deleteBtn}
                    onClick={() =>
                      deleteCompany(company.id)
                    }
                  >
                    Delete
                  </button>

                </div>
              ))
            }

          </div>

        </div>

        {/* JOB POSTS */}

        <div style={styles.section}>

          <h2 style={styles.sectionTitle}>
            Posted Jobs
          </h2>

          <div style={styles.grid}>

            {
              jobs.map((job) => (

                <div
                  key={job.id}
                  style={styles.card}
                >

                  <h3 style={styles.cardTitle}>
                    {job.title}
                  </h3>

                  <p style={styles.text}>
                    Company: {job.company_name}
                  </p>

                  <p style={styles.text}>
                    Salary: {job.salary}
                  </p>

                  <p style={styles.text}>
                    Location: {job.location}
                  </p>

                  <button
                    style={styles.deleteBtn}
                    onClick={() =>
                      deleteJob(job.id)
                    }
                  >
                    Delete Job
                  </button>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;