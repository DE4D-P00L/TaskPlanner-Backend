import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token", success: false });

    const user = await User.findById(decoded._id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in verifyJWT ", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export default verifyToken;
