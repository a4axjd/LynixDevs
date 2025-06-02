
const express = require("express");
const chatService = require("../services/chatService");
const router = express.Router();

// Chat endpoint
router.post("/message", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string"
      });
    }

    const response = await chatService.generateResponse(message, conversationHistory);
    
    res.json(response);
  } catch (error) {
    console.error("Chat message error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

// Project suggestion endpoint
router.post("/project-suggestion", async (req, res) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription || typeof projectDescription !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Project description is required"
      });
    }

    const response = await chatService.generateProjectSuggestion(projectDescription);
    
    res.json(response);
  } catch (error) {
    console.error("Project suggestion error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

// Health check
router.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "chat",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
