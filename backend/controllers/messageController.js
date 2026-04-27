const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Receiver and content are required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ success: false, message: 'Receiver not found' });

    const conversationId = Message.getConversationId(req.user._id, receiverId);

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      conversationId
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:otherUserId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const conversationId = Message.getConversationId(req.user._id, req.params.otherUserId);

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    // Populate user info (this is tricky with aggregate, so we'll do it manually)
    const result = await Promise.all(conversations.map(async (c) => {
      const otherUserId = c.lastMessage.sender.toString() === req.user._id.toString()
        ? c.lastMessage.receiver
        : c.lastMessage.sender;
      
      const otherUser = await User.findById(otherUserId).select('name avatar role');
      return {
        ...c,
        otherUser
      };
    }));

    res.status(200).json({ success: true, conversations: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
