const mysql = require("mysql2");

// Uses environment variables so the same code works locally (via .env)
// and on Render (via dashboard-configured env vars) with Aiven MySQL.
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "lankajobsportal",

    // Aiven requires SSL. Locally this env var will be unset, so SSL is
    // skipped automatically for your local MySQL.
    ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;