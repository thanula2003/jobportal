import axios from "axios";

// Set VITE_API_URL in your .env (local) or in Vercel/Netlify's
// environment variable settings (deployed) to your Render backend URL,
// e.g. https://lankajobsportal-backend.onrender.com
// Falls back to localhost:5000 for local development if unset.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

export default api;