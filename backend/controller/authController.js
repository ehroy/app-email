import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import imaps from "imap-simple";
import { log } from "../utils/log.js";
import moment from "moment";
dotenv.config();
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Email tidak ditemukan");
    }

    if (!user.comparePassword(password)) {
      return res.status(400).send("Kata sandi salah");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan");
  }
};
export const create = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).send("Email dan password wajib diisi");
  }

  // Validasi format email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Format email tidak valid");
  }

  // Validasi panjang password (misalnya minimal 8 karakter)
  if (password.length < 8) {
    return res.status(400).send("Password harus lebih dari 8 karakter");
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email sudah terdaftar");
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat user baru
    const user = new User({
      email,
      password: hashedPassword,
      role: "admin", // Role admin
    });

    // Simpan user
    await user.save();

    // Buat token JWT setelah user berhasil disimpan
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.KEY,
      { expiresIn: "1h" }
    );

    // Mengirimkan token sebagai response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat menyimpan pengguna");
  }
};
export const token = async (req, res) => {
  const { token } = req.body;

  // Validasi input
  if (!token) {
    return res.status(400).send("Authorized token");
  }

  // Validasi panjang password (misalnya minimal 8 karakter)

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email sudah terdaftar");
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat user baru
    const user = new User({
      email,
      password: hashedPassword,
      role: "admin", // Role admin
    });

    // Simpan user
    await user.save();

    // Buat token JWT setelah user berhasil disimpan
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.KEY,
      { expiresIn: "1h" }
    );

    // Mengirimkan token sebagai response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat menyimpan pengguna");
  }
};
export const tes = async (req, res) => {
  const { email, password } = req.body;

  try {
    res.json({ status: 200, message: "peler" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan");
  }
};
export const email = async (req, res) => {
  try {
    const { email } = req.body;

    const connection = await imaps.connect({
      imap: {
        password: process.env.PASSWORD,
        user: process.env.EMAIL,
        host: "imap.gmail.com",
        port: 993,
        authTimeout: 10000,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
      },
    });

    // Fungsi untuk mencari email
    const searchEmails = async () => {
      const box = await connection.openBox("HOUSEHOLD");
      const sinceTime = moment().subtract(12, "hours").toDate();
      const searchCriteria = [
        "ALL",
        ["TO", email],
        ["SINCE", sinceTime.toISOString()],
      ];
      const fetchOptions = {
        bodies: ["HEADER", "TEXT"],
        markSeen: false,
        struct: true,
      };

      // Cari email sesuai kriteria
      const results = await connection.search(searchCriteria, fetchOptions);
      if (results.length === 0) {
        throw new Error("No emails found");
      }

      const formattedResults = results.map((message) => {
        const headers = message.parts.find(
          (part) => part.which === "HEADER"
        ).body;
        const textPart = message.parts.find((part) => part.which === "TEXT");

        return {
          subject: headers.subject?.[0] || "(No Subject)",
          from: headers.from?.[0] || "(Unknown Sender)",
          to: headers.to?.[0] || "(Unknown Sender)",
          date: headers.date?.[0] || "(Unknown Date)",
          text: textPart?.body || "(No Text Content)",
        };
      });

      return formattedResults;
    };

    // Implementasi timeout dengan Promise.race
    const timeout = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: Email not found within 10 seconds")),
        10000 // Timeout 10 detik
      )
    );

    const results = await Promise.race([searchEmails(), timeout]);

    // Kirimkan hasil jika tidak ada error
    if (!res.headersSent) {
      res.json({
        status: 200,
        message: "Success",
        data: results,
      });
    }
  } catch (error) {
    // Pastikan hanya mengirim respons satu kali
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "Terjadi kesalahan" });
    }
  }
};
export default { login, tes, create, email };
