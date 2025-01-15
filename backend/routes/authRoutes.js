import express from "express";
import authController from "../controller/authController.js";
import authenticate from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/login", authController.login);
router.post("/create", authController.create);
router.get("/admin", authController.tes);
router.post("/email", authController.email);
// router.get("/authenticate", authenticate);

router.get("/", authController.tes);

export default router;
