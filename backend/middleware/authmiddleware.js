import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Akses ditolak");
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).send("Token tidak valid");
  }
};
export default { authenticate };
