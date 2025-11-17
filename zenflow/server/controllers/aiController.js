const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// @desc    Generate subtasks based on a main task title (using Gemini)
// @route   POST /api/ai/generate-subtasks
// @access  Private
const generateSubtasks = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400); throw new Error('Title is required');
  }

  const prompt = `For a Kanban board, break down the following main task into 4-5 simple, actionable subtasks. Your response MUST BE ONLY an RFC 8259 compliant JSON string array ["subtask1", "subtask2"]. Do not include any other explanation or introductory text. Main Task: "${title}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const responseText = response.text();
    const subtasks = JSON.parse(responseText.trim()); 
    res.status(200).json(subtasks); 

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to generate subtasks from AI');
  }
});

//-------------------

const generateDescription = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400); throw new Error('Title is required');
  }

  const prompt = `Write a technical description and acceptance criteria for a Kanban task. Your response MUST BE ONLY markdown-formatted text, including "### Description" and "### Acceptance Criteria" headings. Do not include any other explanation. Main Task: "${title}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const descriptionText = response.text();

    res.status(200).json({ description: descriptionText.trim() }); 
  
  } catch (error) {
    console.error('Gemini API Error (Description):', error);
    res.status(500);
    throw new Error('Failed to generate description from AI');
  }
});


// @desc    Suggest tags for a task
// @route   POST /api/ai/suggest-tags
// @access  Private
const suggestTags = asyncHandler(async (req, res) => {
  const { title, description } = req.body; 
k
  const userTags = await Tag.find({ user: req.user.id });
  if (!userTags || userTags.length === 0) {
    return res.status(200).json([]); 
  }

  const tagList = userTags.map(tag => tag.name); // ["Bug", "Feature", "Refactor"]

  const prompt = `Analyze the following task:\nTitle: "${title}"\nDescription: "${description}"\n\nWhich tags (maximum 3) from the following list best match this task?:\n${JSON.stringify(tagList)}\n\nYour response MUST BE ONLY an RFC 8259 compliant JSON string array ["matchedTag1", "matchedTag2"] containing only names from the provided list. Do not include any other explanation.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    const suggestedTagNames = JSON.parse(responseText.trim());

    const suggestedTags = userTags.filter(tag => suggestedTagNames.includes(tag.name));

    res.status(200).json(suggestedTags);

  } catch (error) {
    console.error('Gemini API Error (Tags):', error);
    res.status(500);
    throw new Error('Failed to suggest tags from AI');
  }
});

module.exports = {
  generateSubtasks,
  suggestTags,
  generateDescription
};