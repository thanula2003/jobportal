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
            contact,
            email,
            password,
            status
        )
        VALUES (?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            name,
            address,
            br_number,
            contact,
            email,
            password,
            "pending"
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message:
                    "Company registered successfully"
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

// Render assigns its own PORT via env var — 5000 is only used locally.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});