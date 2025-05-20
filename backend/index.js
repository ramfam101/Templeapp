// Load environment variables from .env
require("dotenv").config();

// Import core dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create the Express app
const app = express();

// Middleware: enable CORS for cross-origin requests
app.use(cors());

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Middleware: parse JSON request bodies
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


// Define the port to run the server on (from .env or fallback to 3000)
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple test route to verify server is running
app.get("/api/ping", (req, res) => {
    res.json({ message: "pong from backend" });
});

// TODO: Add your routes here
// app.use('/api/schedule', require('./routes/schedule'));

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
