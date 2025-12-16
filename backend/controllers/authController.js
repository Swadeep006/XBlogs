import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.json({
        message: "User already exists! Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "Successfully registered! Please login now.",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function loginUser(req, res) {
  try {
    const { identifier, password } = req.body;

    // Check if both fields are provided
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please enter username/email and password" });
    }

    // Determine if identifier is email or username safely
    const isEmail = typeof identifier === "string" && identifier.includes("@");

    let user;
    if (isEmail) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = req.user.id; // comes from authMiddleware (decoded token)
    const { email, password } = req.body;

    const updateFields = {};

    if (email) updateFields.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateFields.password = hashed;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true } // returns updated doc
    ).select("-password"); // exclude password in response

    res.json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const updateProfilePic = async (req, res) => {
  try {
    const username = req.user.username; // decoded from token
    const imagePath = `/uploads/${req.file.filename}`;

    // Update user by username instead of _id
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { profilePic: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ message: "Error updating profile picture" });
  }
};
