
const { genkit } = require("@genkit-ai/core");
const { googleAI } = require("@genkit-ai/googleai");

// Initialize Genkit with Google AI
const ai = genkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

module.exports = { ai };
