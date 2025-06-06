const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/googleai");

const ai = genkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

module.exports = { ai };
