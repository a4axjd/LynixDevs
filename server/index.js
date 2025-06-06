const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import database service
const databaseService = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database connection
async function initializeServer() {
  try {
    console.log("Starting server initialization...");

    // Initialize database
    await databaseService.initialize();
    console.log("Database initialized successfully");

    // Routes
    const adminRoutes = require("./routes/admin");
    const contactRoutes = require("./routes/contact");
    const newsletterRoutes = require("./routes/newsletter");
    const emailRoutes = require("./routes/email");
    const adminSettingsRoutes = require("./routes/adminSettings");
    const adminCountsRoutes = require("./routes/adminCounts");
    const clientProjectsRoutes = require("./routes/clientProjects");
    // New API routes that replace edge functions
    const usersRoutes = require("./routes/users");

    // New public API routes
    const blogRoutes = require("./routes/blog");
    const projectsRoutes = require("./routes/projects");

    // Email automation routes
    const emailAutomationRoutes = require("./routes/emailAutomation");

    // Chat AI routes
    const chatRoutes = require("./routes/chat");

    // Register existing routes
    app.use("/api/admin", adminRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/newsletter", newsletterRoutes);
    app.use("/api/email", emailRoutes);
    app.use("/api/admin/settings", adminSettingsRoutes);
    app.use("/api/admin", adminCountsRoutes);

    // Register new routes that replace edge functions
    app.use("/api/users", usersRoutes);
    app.use("/api/clientProjects", clientProjectsRoutes);
    // Register new public routes
    app.use("/api/blog", blogRoutes);
    app.use("/api/projects", projectsRoutes);

    // Register email automation routes
    app.use("/api/email-automation", emailAutomationRoutes);

    // Register chat AI routes
    app.use("/api/chat", chatRoutes);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        message: "Server is running",
        database: databaseService.isInitialized ? "connected" : "disconnected",
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Server initialization completed successfully");
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

// Start the server
initializeServer();

module.exports = app;
