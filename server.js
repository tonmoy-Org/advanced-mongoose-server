const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

require("dotenv").config();
// middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://www.acecloud.ca', 'https://acecloud-dashboard.vercel.app']
}))


app.use(express.json());
const PORT = process.env.PORT || 5000;

// routes
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const blogRoute = require("./routes/blogRoutes");
const contactRoute = require("./routes/contactRoutes");


mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.mj9te36.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
  )
  .then(() => {
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });



app.use('/api/users', userRoute);
app.use('/api', authRoute);
app.use('/api/blogs', blogRoute);
app.use('/api/contacts', contactRoute);


// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Naturals API!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Naturals Server running on port ${PORT}`);
});