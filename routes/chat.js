const express = require('express');
const authMiddleware = require('../middleware/auth');
const { Message, Conversation } = require('../models/Message');
const PoemRequest = require('../models/PoemRequest');

const router = express.Router();

// Start or get conversation
router.post('/conversations/:requestId', authMiddleware, async (req, res) => {
  try {
    const request = await PoemRequest.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    let conversation = await Conversation.findOne({
      poemRequest: req.params.requestId
    });

    if (!conversation) {
      conversation = new Conversation({
        poemRequest: req.params.requestId,
        participants: [request.patron, request.writer]
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const message = new Message({
      conversation: conversationId,
      sender: req.userId,
      content
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages
router.get('/conversations/:conversationId/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId
    }).populate('sender', 'name role').sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
