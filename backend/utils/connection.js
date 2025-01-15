import mongoose from "mongoose";
import { log } from "./log.js"; // Contoh utilitas log, bisa sesuaikan
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  while (true) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { family: 4 });
      log("✅ Connected to MongoDB", "success");
      break; // Berhenti mencoba jika berhasil
    } catch (err) {
      log("❌ Failed to connect to MongoDB. Retrying in 5 seconds...", "error");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Tunggu 5 detik sebelum mencoba lagi
    }
  }
};

mongoose.connection.on("disconnected", () => {
  log("⚠️ MongoDB disconnected. Attempting to reconnect...", "warning");
  connectDB();
});

export default connectDB;
