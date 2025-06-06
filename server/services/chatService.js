const { ai } = require("../config/genkit");
const { gemini20Flash } = require("@genkit-ai/googleai");

class ChatService {
  constructor() {
    this.systemPrompt = `You are an AI assistant for LynixDevs, a full-service digital agency specializing in web development, UI/UX design, and digital marketing strategies.

About LynixDevs:
- We are a professional digital agency focused on creating modern, responsive websites and applications
- Our services include: Web Development (React, Node.js, TypeScript), UI/UX Design, Digital Marketing, SEO optimization, E-commerce solutions, Mobile app development
- We work with businesses of all sizes, from startups to enterprise companies
- Our team is experienced in modern technologies and follows best practices
- We provide end-to-end solutions from concept to deployment and maintenance

Guidelines for responses:
- Be helpful, professional, and enthusiastic about digital solutions
- When users ask about projects, gather requirements and explain how we can help
- Provide insights about modern web technologies and best practices
- If asked about pricing, mention that we provide custom quotes based on project requirements
- Encourage users to contact us for detailed consultations
- Keep responses concise but informative
- Always maintain a friendly and professional tone

If users ask about specific technical implementations, provide general guidance but recommend a consultation for detailed technical planning.`;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Build conversation context as a single prompt string
      let conversationContext = this.systemPrompt + "\n\n";

      // Add conversation history
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach((msg) => {
          if (msg.role === "user") {
            conversationContext += `User: ${msg.content}\n`;
          } else if (msg.role === "assistant") {
            conversationContext += `Assistant: ${msg.content}\n`;
          }
        });
      }

      // Add current user message
      conversationContext += `User: ${userMessage}\nAssistant:`;

      const response = await ai.generate({
        model: gemini20Flash,
        prompt: conversationContext,
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40,
        },
      });

      // Fix: Use the correct property to get the generated text
      const generatedText =
        response.text ||
        response.output ||
        response.content ||
        response.response;

      return {
        success: true,
        message: generatedText,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Chat service error:", error);
      return {
        success: false,
        message:
          "I'm sorry, I'm having trouble responding right now. Please try again or contact us directly.",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async generateProjectSuggestion(projectDescription) {
    try {
      const prompt = `Based on this project description: "${projectDescription}"

Please provide:
1. A brief analysis of the project requirements
2. Recommended technologies and approach
3. Estimated timeline phases
4. Key considerations for success

Keep the response professional and helpful, focusing on how LynixDevs can deliver value.`;

      const response = await ai.generate({
        model: gemini20Flash,
        prompt: prompt,
        config: {
          temperature: 0.6,
          maxOutputTokens: 800,
        },
      });

      // Fix: Use the correct property to get the generated text
      const generatedText =
        response.text ||
        response.output ||
        response.content ||
        response.response;

      return {
        success: true,
        suggestion: generatedText,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Project suggestion error:", error);
      return {
        success: false,
        suggestion: "Unable to generate project suggestion at the moment.",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

module.exports = new ChatService();
