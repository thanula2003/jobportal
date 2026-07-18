import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const JobSeekerDashboard = () => {

  const navigate = useNavigate();

  const jobseeker = JSON.parse(localStorage.getItem("jobseeker") || "null");

  /*
  ===================================
  STATES
  ===================================
  */

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("all"); // all | saved | applied

  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const [visibleCount, setVisibleCount] = useState(9);

  const [savedIds, setSavedIds] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const savedKey = jobseeker ? `savedJobs_${jobseeker.id}` : null;
  const appliedKey = jobseeker ? `appliedJobs_${jobseeker.id}` : null;

  /*
  ===================================
  INITIAL LOAD
  ===================================
  */

  useEffect(() => {
    if (!jobseeker) {
      navigate("/login");
      return;
    }

    try {
      setSavedIds(JSON.parse(localStorage.getItem(savedKey) || "[]"));
      setAppliedIds(JSON.parse(localStorage.getItem(appliedKey) || "[]"));
    } catch {
      setSavedIds([]);
      setAppliedIds([]);
    }

    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  ===================================
  DEBOUNCE SEARCH
  ===================================
  */

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setVisibleCount(9);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  /*
  ===================================
  FETCH JOBS
  ===================================
  */

  const fetchJobs = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.get("http://localhost:5000/jobs");
      setJobs(res.data || []);
    } catch (error) {
      console.error(error);
      setErrorMsg("Couldn't load jobs right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jobseeker");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  /*
  ===================================
  TOAST HELPER
  ===================================
  */

  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  /*
  ===================================
  SAVE / UNSAVE JOB
  ===================================
  */

  const toggleSave = (jobId, e) => {
    if (e) e.stopPropagation();

    setSavedIds((prev) => {
      const next = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];

      if (savedKey) localStorage.setItem(savedKey, JSON.stringify(next));

      showToast(
        prev.includes(jobId) ? "Removed from saved jobs" : "Saved to your list"
      );

      return next;
    });
  };

  /*
  ===================================
  MARK AS APPLIED
  ===================================
  */

  const markApplied = (jobId, e) => {
    if (e) e.stopPropagation();

    if (appliedIds.includes(jobId)) return;

    const next = [...appliedIds, jobId];
    setAppliedIds(next);

    if (appliedKey) localStorage.setItem(appliedKey, JSON.stringify(next));

    showToast("Marked as applied — good luck!");
  };

  /*
  ===================================
  BUILD MAILTO LINK
  ===================================
  Builds a properly URL-encoded mailto: link so the job seeker's
  default email client opens with the company's apply_email as the
  recipient, and a subject/body already filled in.
  */

  const buildMailto = (job) => {
    if (!job?.apply_email) return null;

    const subject = `Application for ${job.title}`;

    const body =
      `Hi,\n\n` +
      `I would like to apply for the ${job.title} position at ${job.company_name}.\n\n` +
      `Name: ${jobseeker?.name || ""}\n` +
      `Email: ${jobseeker?.email || ""}\n` +
      `Contact: ${jobseeker?.contact || ""}\n\n` +
      `Please find my details/resume attached.\n\n` +
      `Thank you.`;

    return (
      `mailto:${encodeURIComponent(job.apply_email)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`
    );
  };

  /*
  ===================================
  HELPERS
  ===================================
  */

  const parseSalary = (salary) => {
    if (!salary) return 0;
    const digits = String(salary).replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean));
    return Array.from(set);
  }, [jobs]);

  /*
  ===================================
  FILTER + SORT PIPELINE
  ===================================
  */

  const processedJobs = useMemo(() => {
    let list = [...jobs];

    // Tab filter
    if (activeTab === "saved") {
      list = list.filter((j) => savedIds.includes(j.id));
    } else if (activeTab === "applied") {
      list = list.filter((j) => appliedIds.includes(j.id));
    }

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company_name?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q)
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      list = list.filter((j) => j.location === locationFilter);
    }

    // Sort
    if (sortBy === "salary_high") {
      list.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    } else if (sortBy === "salary_low") {
      list.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
    } else if (sortBy === "az") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // newest first (assume higher id = newer)
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }, [jobs, activeTab, debouncedSearch, locationFilter, sortBy, savedIds, appliedIds]);

  const visibleJobs = processedJobs.slice(0, visibleCount);
  const hasMore = visibleCount < processedJobs.length;

  if (!jobseeker) return null;

  const firstName = jobseeker.name.split(" ")[0];

  /*
  ===================================
  INTERNAL CSS
  ===================================
  */

  const styles = {

    page: {
      minHeight: "100vh",
      background: "#f1f5f9",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: "#0f172a"
    },

    /* ── NAVBAR ── */
    navbar: {
      background: "#0f172a",
      padding: "18px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      flexWrap: "wrap",
      gap: "16px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
    },
    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: "18px"
    },
    logo: {
      fontSize: "26px",
      fontWeight: "900",
      color: "#facc15",
      margin: 0,
      letterSpacing: "-0.5px"
    },
    navDivider: {
      width: "1px",
      height: "22px",
      background: "rgba(255,255,255,0.15)"
    },
    greeting: {
      fontSize: "14px",
      color: "#cbd5e1",
      fontWeight: "500"
    },
    greetingName: {
      color: "white",
      fontWeight: "700"
    },
    logoutBtn: {
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "12px 22px",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background 0.15s"
    },

    /* ── MAIN CONTENT ── */
    container: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "36px 30px 60px"
    },

    /* ── HERO ROW ── */
    heroRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "28px",
      flexWrap: "wrap",
      gap: "20px"
    },
    heroHeading: {
      fontSize: "32px",
      fontWeight: "900",
      color: "#0f172a",
      margin: "0 0 6px 0",
      letterSpacing: "-0.5px"
    },
    heroSub: {
      color: "#64748b",
      fontSize: "15px",
      margin: 0
    },
    statsRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap"
    },
    statPill: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "14px 22px",
      textAlign: "center",
      minWidth: "100px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
    },
    statNum: {
      fontSize: "24px",
      fontWeight: "900",
      color: "#2563eb",
      lineHeight: 1
    },
    statLabel: {
      fontSize: "11px",
      color: "#94a3b8",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginTop: "6px"
    },

    /* ── TOOLBAR ── */
    toolbar: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "20px",
      marginBottom: "24px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
      display: "flex",
      flexWrap: "wrap",
      gap: "14px",
      alignItems: "center"
    },
    searchWrap: {
      position: "relative",
      flex: "1 1 260px"
    },
    searchIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "15px",
      color: "#94a3b8",
      pointerEvents: "none"
    },
    searchInput: {
      width: "100%",
      padding: "13px 16px 13px 42px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      outline: "none",
      fontSize: "14px",
      boxSizing: "border-box",
      color: "#0f172a"
    },
    select: {
      padding: "13px 16px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      outline: "none",
      fontSize: "14px",
      color: "#0f172a",
      cursor: "pointer",
      minWidth: "160px"
    },

    /* ── TABS ── */
    tabRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "20px",
      flexWrap: "wrap"
    },
    tabBtn: (active) => ({
      padding: "10px 20px",
      borderRadius: "10px",
      border: "none",
      background: active ? "#0f172a" : "#e2e8f0",
      color: active ? "white" : "#475569",
      fontWeight: "700",
      fontSize: "13px",
      cursor: "pointer",
      transition: "all 0.15s"
    }),

    /* ── LISTINGS HEADER ── */
    listingsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
      flexWrap: "wrap",
      gap: "8px"
    },
    resultsMeta: {
      fontSize: "13px",
      color: "#94a3b8",
      fontWeight: "500"
    },

    /* ── GRID ── */
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
      gap: "18px"
    },

    /* ── JOB CARD ── */
    card: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "18px",
      padding: "22px",
      transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      position: "relative",
      animation: "jsdFadeIn 0.35s ease"
    },
    cardHovered: {
      boxShadow: "0 14px 34px rgba(37,99,235,0.12)",
      borderColor: "#93c5fd",
      transform: "translateY(-3px)"
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "10px",
      gap: "10px"
    },
    cardTitle: {
      fontSize: "17px",
      fontWeight: "800",
      color: "#0f172a",
      margin: "0 0 4px 0"
    },
    companyName: {
      color: "#2563eb",
      fontWeight: "600",
      fontSize: "13px",
      margin: 0
    },
    saveBtn: (active) => ({
      background: active ? "#fef3c7" : "#f1f5f9",
      border: "none",
      borderRadius: "10px",
      width: "36px",
      height: "36px",
      minWidth: "36px",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.15s"
    }),
    appliedBadge: {
      position: "absolute",
      top: "18px",
      right: "60px",
      background: "#dcfce7",
      color: "#16a34a",
      fontSize: "11px",
      fontWeight: "800",
      padding: "5px 10px",
      borderRadius: "20px",
      letterSpacing: "0.3px"
    },
    cardDivider: {
      height: "1px",
      background: "#f1f5f9",
      margin: "12px 0"
    },
    metaGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginBottom: "12px"
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      color: "#475569"
    },
    metaText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    description: {
      color: "#64748b",
      fontSize: "13px",
      lineHeight: "1.65",
      marginBottom: "16px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      flex: 1
    },
    cardFooter: {
      display: "flex",
      gap: "10px",
      marginTop: "auto"
    },
    applyBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      background: "#2563eb",
      color: "white",
      padding: "11px 18px",
      borderRadius: "10px",
      fontWeight: "700",
      fontSize: "13px",
      textDecoration: "none",
      flex: 1,
      letterSpacing: "0.2px",
      border: "none",
      cursor: "pointer"
    },
    applyBtnDisabled: {
      background: "#cbd5e1",
      color: "#64748b",
      cursor: "not-allowed"
    },
    detailsBtn: {
      background: "#f1f5f9",
      color: "#0f172a",
      border: "none",
      padding: "11px 16px",
      borderRadius: "10px",
      fontWeight: "700",
      fontSize: "13px",
      cursor: "pointer"
    },

    /* ── LOAD MORE ── */
    loadMoreWrap: {
      display: "flex",
      justifyContent: "center",
      marginTop: "26px"
    },
    loadMoreBtn: {
      background: "white",
      border: "1px solid #e2e8f0",
      color: "#0f172a",
      padding: "13px 30px",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
      boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
    },

    /* ── EMPTY / LOADING ── */
    emptyWrap: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "18px",
      padding: "60px 30px",
      textAlign: "center"
    },
    emptyIcon: {
      fontSize: "36px",
      marginBottom: "12px"
    },
    emptyText: {
      color: "#64748b",
      fontSize: "16px",
      fontWeight: "600",
      margin: 0
    },
    emptyHint: {
      color: "#94a3b8",
      fontSize: "13px",
      marginTop: "6px"
    },

    skeletonCard: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "18px",
      padding: "22px",
      height: "220px",
      overflow: "hidden",
      position: "relative"
    },
    skeletonLine: (w, h, mb) => ({
      width: w,
      height: h || "12px",
      marginBottom: mb || "12px",
      borderRadius: "6px",
      background:
        "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%)",
      backgroundSize: "400% 100%",
      animation: "jsdShimmer 1.4s ease infinite"
    }),

    /* ── MODAL ── */
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 1000,
      animation: "jsdFadeIn 0.2s ease"
    },
    modalCard: {
      background: "white",
      borderRadius: "24px",
      maxWidth: "620px",
      width: "100%",
      maxHeight: "85vh",
      overflowY: "auto",
      padding: "36px",
      boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
      animation: "jsdSlideUp 0.25s ease"
    },
    modalClose: {
      position: "absolute",
      top: "18px",
      right: "18px",
      background: "#f1f5f9",
      border: "none",
      borderRadius: "10px",
      width: "34px",
      height: "34px",
      cursor: "pointer",
      fontSize: "16px"
    },

    /* ── TOAST ── */
    toast: {
      position: "fixed",
      bottom: "28px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#0f172a",
      color: "white",
      padding: "14px 26px",
      borderRadius: "14px",
      fontSize: "14px",
      fontWeight: "600",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      zIndex: 1200,
      animation: "jsdSlideUp 0.25s ease"
    }
  };

  return (
    <div style={styles.page}>

      {/* Keyframes for smooth motion — inline-friendly via <style> tag */}
      <style>
        {`
          @keyframes jsdFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes jsdSlideUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes jsdShimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}
      </style>

      {/* ── NAVBAR ── */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <h1 style={styles.logo}>LankaJobsPortal</h1>
          <div style={styles.navDivider} />
          <span style={styles.greeting}>
            Welcome back, <span style={styles.greetingName}>{firstName}</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) => (e.target.style.background = "#dc2626")}
          onMouseLeave={(e) => (e.target.style.background = "#ef4444")}
        >
          Logout
        </button>
      </nav>

      {/* ── MAIN ── */}
      <div style={styles.container}>

        {/* HERO ROW */}
        <div style={styles.heroRow}>
          <div>
            <h2 style={styles.heroHeading}>Find Your Next Opportunity</h2>
            <p style={styles.heroSub}>Explore live job listings across Sri Lanka</p>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.statPill}>
              <div style={styles.statNum}>{jobs.length}</div>
              <div style={styles.statLabel}>Jobs Live</div>
            </div>
            <div style={styles.statPill}>
              <div style={styles.statNum}>{processedJobs.length}</div>
              <div style={styles.statLabel}>Matched</div>
            </div>
            <div style={styles.statPill}>
              <div style={{ ...styles.statNum, color: "#facc15" }}>{savedIds.length}</div>
              <div style={styles.statLabel}>Saved</div>
            </div>
            <div style={styles.statPill}>
              <div style={{ ...styles.statNum, color: "#16a34a" }}>{appliedIds.length}</div>
              <div style={styles.statLabel}>Applied</div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={styles.tabRow}>
          <button
            style={styles.tabBtn(activeTab === "all")}
            onClick={() => { setActiveTab("all"); setVisibleCount(9); }}
          >
            All Jobs
          </button>
          <button
            style={styles.tabBtn(activeTab === "saved")}
            onClick={() => { setActiveTab("saved"); setVisibleCount(9); }}
          >
            Saved ({savedIds.length})
          </button>
          <button
            style={styles.tabBtn(activeTab === "applied")}
            onClick={() => { setActiveTab("applied"); setVisibleCount(9); }}
          >
            Applied ({appliedIds.length})
          </button>
        </div>

        {/* TOOLBAR: SEARCH + FILTERS */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by job title, company, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <select
            value={locationFilter}
            onChange={(e) => { setLocationFilter(e.target.value); setVisibleCount(9); }}
            style={styles.select}
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="newest">Newest First</option>
            <option value="salary_high">Salary: High to Low</option>
            <option value="salary_low">Salary: Low to High</option>
            <option value="az">Title: A to Z</option>
          </select>
        </div>

        {/* LISTINGS HEADER */}
        <div style={styles.listingsHeader}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
            Job Listings
          </h3>
          <span style={styles.resultsMeta}>
            {processedJobs.length} result{processedJobs.length !== 1 ? "s" : ""}
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </span>
        </div>

        {/* LISTINGS */}
        {loading ? (
          <div style={styles.grid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={styles.skeletonCard}>
                <div style={styles.skeletonLine("70%", "18px", "14px")} />
                <div style={styles.skeletonLine("40%")} />
                <div style={styles.skeletonLine("100%")} />
                <div style={styles.skeletonLine("100%")} />
                <div style={styles.skeletonLine("50%")} />
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div style={styles.emptyWrap}>
            <div style={styles.emptyIcon}>⚠️</div>
            <p style={styles.emptyText}>{errorMsg}</p>
            <p style={styles.emptyHint} onClick={fetchJobs}>
              <span style={{ cursor: "pointer", color: "#2563eb", fontWeight: 700 }}>
                Try again
              </span>
            </p>
          </div>
        ) : processedJobs.length === 0 ? (
          <div style={styles.emptyWrap}>
            <div style={styles.emptyIcon}>
              {activeTab === "saved" ? "🔖" : activeTab === "applied" ? "📮" : "🔎"}
            </div>
            <p style={styles.emptyText}>
              {activeTab === "saved"
                ? "You haven't saved any jobs yet."
                : activeTab === "applied"
                ? "You haven't applied to any jobs yet."
                : `No jobs found${debouncedSearch ? ` for "${debouncedSearch}"` : ""}.`}
            </p>
            {(debouncedSearch || locationFilter !== "all") && activeTab === "all" && (
              <p style={styles.emptyHint}>Try a different keyword or clear the filters.</p>
            )}
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {visibleJobs.map((job) => {
                const isSaved = savedIds.includes(job.id);
                const isApplied = appliedIds.includes(job.id);
                const mailtoLink = buildMailto(job);

                return (
                  <div
                    key={job.id}
                    style={{
                      ...styles.card,
                      ...(hoveredCard === job.id ? styles.cardHovered : {})
                    }}
                    onMouseEnter={() => setHoveredCard(job.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => setSelectedJob(job)}
                  >
                    {isApplied && <div style={styles.appliedBadge}>Applied</div>}

                    {/* Card Header */}
                    <div style={styles.cardHeader}>
                      <div>
                        <h3 style={styles.cardTitle}>{job.title}</h3>
                        <p style={styles.companyName}>{job.company_name}</p>
                      </div>

                      <button
                        style={styles.saveBtn(isSaved)}
                        onClick={(e) => toggleSave(job.id, e)}
                        title={isSaved ? "Remove from saved" : "Save job"}
                      >
                        {isSaved ? "★" : "☆"}
                      </button>
                    </div>

                    <div style={styles.cardDivider} />

                    {/* Meta */}
                    <div style={styles.metaGrid}>
                      <div style={styles.metaItem}>
                        <span>📍</span>
                        <span style={styles.metaText}>{job.location}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span>💰</span>
                        <span style={styles.metaText}>{job.salary}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span>👥</span>
                        <span style={styles.metaText}>
                          {job.positions} position{job.positions !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={styles.description}>{job.description}</p>

                    {/* Footer Actions */}
                    <div style={styles.cardFooter} onClick={(e) => e.stopPropagation()}>
                      {mailtoLink ? (
                        <a
                          href={mailtoLink}
                          style={styles.applyBtn}
                          onClick={() => markApplied(job.id)}
                        >
                          {isApplied ? "Applied ✓" : "Apply Now →"}
                        </a>
                      ) : (
                        <button
                          style={{ ...styles.applyBtn, ...styles.applyBtnDisabled }}
                          disabled
                          title="This company hasn't provided an application email"
                        >
                          Email Unavailable
                        </button>
                      )}

                      <button
                        style={styles.detailsBtn}
                        onClick={() => setSelectedJob(job)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div style={styles.loadMoreWrap}>
                <button
                  style={styles.loadMoreBtn}
                  onClick={() => setVisibleCount((c) => c + 9)}
                >
                  Load More Jobs
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* ── JOB DETAILS MODAL ── */}
      {selectedJob && (
        <div style={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div style={{ position: "relative" }}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <button
                style={styles.modalClose}
                onClick={() => setSelectedJob(null)}
              >
                ✕
              </button>

              <h2 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "6px" }}>
                {selectedJob.title}
              </h2>
              <p style={{ color: "#2563eb", fontWeight: 700, marginBottom: "20px" }}>
                {selectedJob.company_name}
              </p>

              <div style={{ ...styles.metaGrid, gridTemplateColumns: "1fr 1fr 1fr", marginBottom: "20px" }}>
                <div style={styles.metaItem}><span>📍</span><span>{selectedJob.location}</span></div>
                <div style={styles.metaItem}><span>💰</span><span>{selectedJob.salary}</span></div>
                <div style={styles.metaItem}><span>👥</span><span>{selectedJob.positions} positions</span></div>
              </div>

              <div style={styles.cardDivider} />

              <h4 style={{ fontSize: "15px", fontWeight: 800, margin: "16px 0 8px" }}>
                Job Description
              </h4>
              <p style={{ color: "#475569", lineHeight: 1.75, fontSize: "14px", marginBottom: "28px" }}>
                {selectedJob.description}
              </p>

              {!selectedJob.apply_email && (
                <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "-16px", marginBottom: "20px" }}>
                  This company hasn't provided an application email yet.
                </p>
              )}

              <div style={{ display: "flex", gap: "12px" }}>
                {buildMailto(selectedJob) ? (
                  <a
                    href={buildMailto(selectedJob)}
                    style={{ ...styles.applyBtn, padding: "14px 20px" }}
                    onClick={() => markApplied(selectedJob.id)}
                  >
                    {appliedIds.includes(selectedJob.id) ? "Applied ✓" : "Apply Now →"}
                  </a>
                ) : (
                  <button
                    style={{ ...styles.applyBtn, ...styles.applyBtnDisabled, padding: "14px 20px" }}
                    disabled
                  >
                    Email Unavailable
                  </button>
                )}

                <button
                  style={{ ...styles.saveBtn(savedIds.includes(selectedJob.id)), width: "auto", padding: "0 18px" }}
                  onClick={(e) => toggleSave(selectedJob.id, e)}
                >
                  {savedIds.includes(selectedJob.id) ? "★ Saved" : "☆ Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div style={styles.toast}>{toast}</div>}

    </div>
  );
};

export default JobSeekerDashboard;