import jwt from "jsonwebtoken";

const data = { email: "pepegrillo@example.com" };

const token = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
