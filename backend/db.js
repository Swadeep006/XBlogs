import mongoose from "mongoose";

export async function connectToDB() {
  const DB_URI = process.env.MONGODB_URI;
  try {
    const connection = await mongoose.connect(DB_URI);
    console.log("Connected Successfully : ", connection.connection.host);
  } catch (error) {
    console.log("Connection failed", error);
  }
}
