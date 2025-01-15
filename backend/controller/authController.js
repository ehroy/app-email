import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import imaps from "imap-simple";
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
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).send("not found search query");
    }
    const connection = await imaps.connect({
      imap: {
        password: "fgzhmcxyjzeaulji",
        user: "rikayenasi109@gmail.com",
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
    res.json({ status: 200, message: "peler" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan");
  }
};
export default { login, tes, create, email };
