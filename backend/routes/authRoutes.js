import express from "express";
import authController from "../controller/authController.js";
const router = express.Router();

router.post("/login", authController.login);
router.post("/create", authController.create);
router.get("/admin", authController.tes);
router.get("/email", authController.tes);
router.get("/", authController.tes);

export default router;
