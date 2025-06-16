const { ai } = require("../config/genkit");
const { gemini20Flash } = require("@genkit-ai/googleai");

class ChatService {
  constructor() {
    this.systemPrompt = `You are an AI assistant for LynixDevs, a full-service digital agency specializing in web development, UI/UX design, and digital marketing strategies.

About LynixDevs:
LynixDevs is a full-service digital-tech hybrid agency specializing in modern web development, UI/UX design, and digital marketing strategies that drive real business growth. We work with startups, SMEs, and enterprise-level businesses to deliver scalable, high-performance digital solutions. Our services include responsive website and mobile app development using modern stacks like React, Next.js, Node.js, and TypeScript; UI/UX design with user-focused research, wireframing, prototyping, and accessibility standards; and a wide range of digital marketing solutions including SEO, paid ad campaigns, content creation, social media strategy, and conversion optimization. We also offer complete e-commerce solutions using Shopify, WooCommerce, and headless setups, along with payment gateway integration and custom storefronts. For businesses looking to leverage emerging technologies, we provide AI/ML integrations, chatbot development, process automation, IoT solutions, and blockchain development. On the backend, we specialize in API development, cloud infrastructure, CI/CD pipelines, database optimization, and security hardening. Additionally, our analytics services help businesses track performance through custom dashboards, funnel analysis, and A/B testing. LynixDevs supports long-term success through comprehensive maintenance, hosting, and SLA-based technical support. We follow industry best practices, ensure responsive and mobile-first design, and handle projects from initial concept through development, deployment, and ongoing optimization. For pricing, we provide custom quotes based on project scope and encourage potential clients to contact us for a free consultation to explore their specific needs.

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
