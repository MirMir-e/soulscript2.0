const express = require('express');
const authMiddleware = require('../middleware/auth');
const PoemRequest = require('../models/PoemRequest');

const router = express.Router();

// Submit poem
router.post('/:requestId/submit', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'writer') {
      return res.status(403).json({ message: 'Only writers can submit poems' });
    }

    const { poemContent } = req.body;
    const request = await PoemRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.writer.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not assigned to this request' });
    }

    request.poemContent = poemContent;
    request.status = 'completed';
    await request.save();

    res.json({
      message: 'Poem submitted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deliver poem
router.post('/:requestId/deliver', authMiddleware, async (req, res) => {
  try {
    const request = await PoemRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.writer.toString() !== req.userId && request.patron.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = 'delivered';
    request.deliveredAt = new Date();
    await request.save();

    res.json({
      message: 'Poem delivered successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get delivered poems (Patrons only view their own)
router.get('/delivered', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'patron') {
      return res.status(403).json({ message: 'Only patrons can view delivered poems' });
    }

    const poems = await PoemRequest.find({
      patron: req.userId,
      status: 'delivered'
    }).populate('writer', 'name email rating');

    res.json(poems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
