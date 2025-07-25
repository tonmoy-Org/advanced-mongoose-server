const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(helmet()); // Adds security headers
app.use(morgan("dev")); // Logs HTTP requests

// Import routes
const blogRoute = require("./routes/blogRoutes");

// Routes
app.use("/api/v1/blogs", blogRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Welcome to the MongoDB Practice Server!" });
});

// MongoDB connection
mongoose.connect(process.env.DB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("✅ Connected to MongoDB!"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1); // Exit process on DB failure
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
