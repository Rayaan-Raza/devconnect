const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(sendMessage);

router.get('/conversations', getConversations);
router.get('/:otherUserId', getConversation);

module.exports = router;
