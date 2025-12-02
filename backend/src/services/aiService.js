const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize only if API key exists
const apiKey = process.env.GEMINI_API_KEY;
let model = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

// Helper to check if AI is available
const checkAIAvailable = () => {
  if (!model) {
    throw new Error('AI service not configured. Please set GEMINI_API_KEY.');
  }
};

// Generate blog title
const generateTitle = async (content) => {
  checkAIAvailable();

  const prompt = `Generate a catchy, SEO-friendly blog title for the following content. Return ONLY the title, nothing else:

${content}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

// Generate summary
const generateSummary = async (content) => {
  checkAIAvailable();

  const prompt = `Write a concise 2-3 sentence summary for the following blog content. The summary should be engaging and capture the main points. Return ONLY the summary, nothing else:

${content}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

// Generate tags
const generateTags = async (content) => {
  checkAIAvailable();

  const prompt = `Generate 5 relevant SEO tags/keywords for the following blog content. Return ONLY a JSON array of strings, nothing else. Example: ["tag1", "tag2", "tag3", "tag4", "tag5"]

${content}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  try {
    // Try to parse as JSON
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    // If not valid JSON, try to extract tags from text
    const matches = text.match(/["']([^"']+)["']/g);
    if (matches) {
      return matches.map(m => m.replace(/["']/g, '')).slice(0, 5);
    }
    return [];
  }
};

// Generate blog outline
const generateOutline = async (content, title) => {
  checkAIAvailable();

  const prompt = `Create a structured blog outline based on the following ${title ? `title: "${title}"` : 'content'}.
Format it as markdown with headers (##) and bullet points. Keep it concise but comprehensive.

${content || title}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

// Rewrite content
const rewriteContent = async (content) => {
  checkAIAvailable();

  const prompt = `Rewrite the following content to be more engaging, clear, and well-structured. Maintain the original meaning but improve the writing quality. Return ONLY the rewritten content:

${content}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

module.exports = {
  generateTitle,
  generateSummary,
  generateTags,
  generateOutline,
  rewriteContent
};
