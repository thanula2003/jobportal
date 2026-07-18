require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const app = express();

// FRONTEND_URL should be your deployed Vercel/Netlify URL, e.g.
// https://lankajobsportal.vercel.app
// Locally, FRONTEND_URL is unset, so it falls back to allowing
// http://localhost:5173 (Vite's default dev port).
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());

/*
=================================
COMPANY REGISTER
=================================
*/

app.post("/company/register", (req, res) => {

    const {
        name,
        address,
        br_number,
        website,
        contact,
        email,
        password
    } = req.body;

    const sql = `
        INSERT INTO companies
        (
            name,
            address,
            br_number,
            website,
            contact,
            email,
            password,
            status
        )
        VALUES (?,?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            name,
            address,
            br_number,
            website,
            contact,
            email,
            password,
            "pending"
        ],
        (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.json({
                        success: false,
                        message: "An account with this email already exists"
                    });
                }

                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Company registered successfully"
            });
        }
    );
});

/*
=================================
COMPANY LOGIN
=================================
*/

app.post("/company/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM companies
        WHERE email=? AND password=?
    `;

    db.query(
        sql,
        [email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {

                return res.json({
                    success: false,
                    message:
                        "Invalid credentials"
                });
            }

            const company = result[0];

            if (
                company.status ===
                "pending"
            ) {

                return res.json({
                    success: false,
                    pending: true,
                    message:
                        "Registration pending"
                });
            }

            res.json({
                success: true,
                company
            });
        }
    );
});

/*
=================================
JOB SEEKER REGISTER
=================================
*/

app.post("/jobseeker/register", (req, res) => {

    const {
        name,
        contact,
        email,
        password
    } = req.body;

    const sql = `
        INSERT INTO jobseekers
        (
            name,
            contact,
            email,
            password
        )
        VALUES (?,?,?,?)
    `;

    db.query(
        sql,
        [name, contact, email, password],
        (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.json({
                        success: false,
                        message: "An account with this email already exists"
                    });
                }

                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Account created successfully"
            });
        }
    );
});

/*
=================================
JOB SEEKER LOGIN
=================================
*/

app.post("/jobseeker/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM jobseekers
        WHERE email=? AND password=?
    `;

    db.query(
        sql,
        [email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            res.json({
                success: true,
                jobseeker: result[0]
            });
        }
    );
});

/*
=================================
GET ALL JOBS (public listings)
=================================
*/

app.get("/jobs", (req, res) => {

    const sql = `
        SELECT * FROM jobs
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

/*
=================================
GET JOBS FOR ONE COMPANY
=================================
*/

app.get("/company/jobs/:company_id", (req, res) => {

    const sql = `
        SELECT * FROM jobs
        WHERE company_id=?
        ORDER BY id DESC
    `;

    db.query(
        sql,
        [req.params.company_id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
});

/*
=================================
POST NEW JOB
=================================
*/

app.post("/company/post-job", (req, res) => {

    const {
        company_id,
        company_name,
        title,
        apply_email,
        salary,
        location,
        positions,
        description
    } = req.body;

    const sql = `
        INSERT INTO jobs
        (
            company_id,
            company_name,
            title,
            apply_email,
            salary,
            location,
            positions,
            description
        )
        VALUES (?,?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            company_id,
            company_name,
            title,
            apply_email,
            salary,
            location,
            positions,
            description
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Job posted successfully"
            });
        }
    );
});

/*
=================================
DELETE JOB (company-owned)
=================================
*/

app.delete("/company/delete-job/:id", (req, res) => {

    const sql = `
        DELETE FROM jobs WHERE id=?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({ message: "Job deleted" });
        }
    );
});

/*
=================================
GET PENDING COMPANIES
=================================
*/

app.get("/admin/pending-companies", (req, res) => {

    const sql = `
        SELECT * FROM companies
        WHERE status='pending'
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

/*
=================================
GET ALL COMPANIES
=================================
*/

app.get(
    "/admin/all-companies",
    (req, res) => {

        const sql = `
            SELECT * FROM companies
            ORDER BY id DESC
        `;

        db.query(
            sql,
            (err, result) => {

                if (err) {
                    return res
                        .status(500)
                        .json(err);
                }

                res.json(result);
            }
        );
    }
);

/*
=================================
GET ALL JOBS (admin view)
=================================
*/

app.get("/admin/all-jobs", (req, res) => {

    const sql = `
        SELECT * FROM jobs
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

/*
=================================
GET ALL JOB SEEKERS
=================================
*/

app.get("/admin/jobseekers", (req, res) => {

    const sql = `
        SELECT * FROM jobseekers
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

/*
=================================
APPROVE COMPANY
=================================
*/

app.put(
    "/admin/approve-company/:id",
    (req, res) => {

        const companyId =
            req.params.id;

        const sql = `
            UPDATE companies
            SET status='approved'
            WHERE id=?
        `;

        db.query(
            sql,
            [companyId],
            (err, result) => {

                if (err) {
                    return res
                        .status(500)
                        .json(err);
                }

                res.json({
                    message:
                        "Company approved"
                });
            }
        );
    }
);

/*
=================================
DELETE COMPANY
=================================
*/

app.delete("/admin/delete-company/:id", (req, res) => {

    const sql = `
        DELETE FROM companies WHERE id=?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({ message: "Company deleted" });
        }
    );
});

/*
=================================
DELETE JOB (admin)
=================================
*/

app.delete("/admin/delete-job/:id", (req, res) => {

    const sql = `
        DELETE FROM jobs WHERE id=?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({ message: "Job deleted" });
        }
    );
});

// Render assigns its own PORT via env var — 5000 is only used locally.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});