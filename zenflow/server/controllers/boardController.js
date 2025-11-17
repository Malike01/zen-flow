const asyncHandler = require('express-async-handler');
const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');

// -----------------------------------------------------------------
// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
  const { name } = req.body; // Pano adını al
  if (!name) {
    res.status(400);
    throw new Error('Please provide a board name');
  }

  const newBoard = await Board.create({
    name,
    owner: req.user.id,
    members: [req.user.id], 
  });

  const defaultColumns = [
    { title: 'To Do', board: newBoard._id },
    { title: 'In Progress', board: newBoard._id },
    { title: 'Done', board: newBoard._id },
  ];
  const createdColumns = await Column.insertMany(defaultColumns);

  newBoard.columns = createdColumns.map((col) => col._id);
  await newBoard.save();

  res.status(201).json(newBoard);
});

// -----------------------------------------------------------------
// @desc    Get all boards a user is a member of
// @route   GET /api/boards
// @access  Private
const getMyBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ members: req.user.id }).select('name owner createdAt');
  res.status(200).json(boards);
});

// -----------------------------------------------------------------
// @desc    Get a single board by its ID
// @route   GET /api/boards/:boardId
// @access  Private
const getBoardById = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  if (!board.members.map(m => m.toString()).includes(req.user.id)) {
    res.status(403); 
    throw new Error('User not authorized to access this board');
  }

  const populatedBoard = await Board.findById(boardId).populate({
    path: 'columns',
    populate: {
      path: 'tasks', 
      populate: {
        path: 'tags', 
        model: 'Tag',
      },
    },
  });

  res.status(200).json(populatedBoard);
});

const inviteUserToBoard = asyncHandler(async (req, res) => {
  const { email } = req.body; 
  const { boardId } = req.params;
  const inviterId = req.user.id; 

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email to invite');
  }

  const userToInvite = await User.findOne({ email: email.toLowerCase() });
  if (!userToInvite) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Board not found');
  }

  if (board.owner.toString() !== inviterId) {
    res.status(403); // Yasaklı
    throw new Error('Only the board owner can invite members');
  }

  if (board.members.map(m => m.toString()).includes(userToInvite._id.toString())) {
    res.status(400);
    throw new Error('User is already a member of this board');
  }

  await board.updateOne({ $addToSet: { members: userToInvite._id } });

  res.status(200).json({ message: 'User invited successfully' });
});

module.exports = {
  createBoard,
  getMyBoards,
  getBoardById,
  inviteUserToBoard
};