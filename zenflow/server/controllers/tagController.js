const asyncHandler = require('express-async-handler');
const Tag = require('../models/Tag');
const Task = require('../models/Task');

// @desc    Get all tags for the logged-in user
// @route   GET /api/tags
// @access  Private
const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find({ user: req.user.id });
  res.status(200).json(tags);
});

// @desc    Create a new tag
// @route   POST /api/tags
// @access  Private
const createTag = asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    res.status(400);
    throw new Error('Please provide name and color');
  }

  const tag = await Tag.create({
    name,
    color,
    user: req.user.id,
  });
  res.status(201).json(tag);
});

// @desc    Update a tag
// @route   PUT /api/tags/:id
// @access  Private
const updateTag = asyncHandler(async (req, res) => {
  const { id: tagId } = req.params;
  const { name, color } = req.body;

  const tag = await Tag.findOne({ _id: tagId, user: req.user.id });
  if (!tag) {
    res.status(404); throw new Error('Tag not found');
  }

  tag.name = name || tag.name;
  tag.color = color || tag.color;
  const updatedTag = await tag.save();
  
  res.status(200).json(updatedTag);
});

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Private
const deleteTag = asyncHandler(async (req, res) => {
  const { id: tagId } = req.params;

  const tag = await Tag.findOne({ _id: tagId, user: req.user.id });
  if (!tag) {
    res.status(404); throw new Error('Tag not found');
  }

  await tag.deleteOne();

  await Task.updateMany(
    { user: req.user.id, tags: tagId }, 
    { $pull: { tags: tagId } }
  );

  res.status(200).json({ message: 'Tag deleted and removed from tasks' });
});

module.exports = { getTags, createTag, updateTag, deleteTag };