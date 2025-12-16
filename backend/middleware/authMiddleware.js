import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Invalid auth header",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.json({
      message: "Token malformed/expired",
    });
  }
}
