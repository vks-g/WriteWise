const {
  generateTitle,
  generateSummary,
  generateTags,
  generateOutline,
  rewriteContent
} = require('@/services/aiService');

// POST /ai/generate-title
const GenerateTitle = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required to generate a title' });
    }

    const title = await generateTitle(content);
    res.status(200).json({ title });
  } catch (error) {
    console.error('Error generating title:', error);
    res.status(500).json({ error: 'Failed to generate title' });
  }
};

// POST /ai/summary
const GenerateSummary = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required to generate a summary' });
    }

    const summary = await generateSummary(content);
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

// POST /ai/tags
const GenerateTags = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required to generate tags' });
    }

    const tags = await generateTags(content);
    res.status(200).json({ tags });
  } catch (error) {
    console.error('Error generating tags:', error);
    res.status(500).json({ error: 'Failed to generate tags' });
  }
};

// POST /ai/outline
const GenerateOutline = async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content && !title) {
      return res.status(400).json({ error: 'Content or title is required to generate an outline' });
    }

    const outline = await generateOutline(content, title);
    res.status(200).json({ outline });
  } catch (error) {
    console.error('Error generating outline:', error);
    res.status(500).json({ error: 'Failed to generate outline' });
  }
};

// POST /ai/rewrite
const RewriteContent = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required to rewrite' });
    }

    const rewritten = await rewriteContent(content);
    res.status(200).json({ content: rewritten });
  } catch (error) {
    console.error('Error rewriting content:', error);
    res.status(500).json({ error: 'Failed to rewrite content' });
  }
};

module.exports = {
  GenerateTitle,
  GenerateSummary,
  GenerateTags,
  GenerateOutline,
  RewriteContent
};
