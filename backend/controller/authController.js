import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import imaps from "imap-simple";
import { log } from "../utils/log.js";
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
    console.log(email);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token || !email) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    await jwt.verify(token, process.env.KEY, async (err, userId) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      log("waiting get email ", "warning");

      try {
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
        const box = await connection.openBox("INBOX");
        const searchCriteria = ["ALL", ["TO", email]];
        const fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: false,
        };
        let results;
        let validasiemailotp;
        do {
          results = await connection.search(searchCriteria, fetchOptions);
          validasiemailotp = JSON.stringify(results);
        } while (!validasiemailotp.includes("attributes"));
        console.log(validasiemailotp);
        res.json({
          status: 200,
          message: "success get all",
          data: results,
        });
      } catch (error) {
        return res.status(500).json({ message: "Terjadi kelemahan" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kelemahan" });
  }
};
export default { login, tes, create, email };
