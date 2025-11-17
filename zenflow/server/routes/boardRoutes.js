const express = require('express');
const router = express.Router();
const {
  createBoard,
  getMyBoards,
  getBoardById,
  inviteUserToBoard
} = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware'); 

router.use(protect);

router.route('/')
  .get(getMyBoards)
  .post(createBoard);

router.route('/:boardId').get(getBoardById);
router.route('/:boardId/invite').post(inviteUserToBoard);

module.exports = router;