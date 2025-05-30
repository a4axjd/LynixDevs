const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
const newsletterRoutes = require("./routes/newsletter");
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const adminSettingsRoutes = require("./routes/adminSettings");

// Register routes
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
