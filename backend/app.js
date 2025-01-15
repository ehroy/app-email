import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./utils/connection.js";
import cors from "cors";

// Create express app
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Ganti dengan domain frontend Anda
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Sesuaikan metode yang diizinkan
    credentials: true, // Jika Anda mengirim cookie atau header otentikasi
  })
);
connectDB();
// Use Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
