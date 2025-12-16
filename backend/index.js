import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./db.js";
import Blog from "./models/Blog.js";
import User from "./models/User.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
connectToDB(); // database call

import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes); // authentication

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// get all blogs end point

app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

app.get("/me", async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username });
  res.json(user);
});

// get loggedin user blogs end point

app.get("/myblogs", async (req, res) => {
  try {
    const username = req.query.username;
    const blogs = await Blog.find({ username });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get single blog endpoint

app.get("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  res.json(blog);
});

//post end point

app.post("/newblog", async (req, res) => {
  try {
    const { username, thumbnailurl, title, content } = req.body;
    const blog = await Blog.create({ username, thumbnailurl, title, content });
    res.json({ message: "Successfully added", blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving blog" });
  }
});

// edit end point

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndUpdate(id, req.body);
  res.json({ message: "Blog updated" });
});

// delete end point

app.delete("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.json({ message: "Blog deleted" });
});

// adding mock data at a time

app.post("/blogs/many", async (req, res) => {
  try {
    const mockBlogs = req.body;
    await Blog.insertMany(mockBlogs);
    res.json({ message: "uploaded many blogs" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// authentication check

app.get("/supersecretendpoint", authMiddleware, (req, res) => {
  return res.json({
    message: "You are a genuine user",
  });
});

// server running check

app.listen(5000, () => {
  console.log("");
  console.log("XBlogs's Server is running");
  console.log("");
});
