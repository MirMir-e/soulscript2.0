const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const User = require('../models/User');
const PoemRequest = require('../models/PoemRequest');

const router = express.Router();

// Get all pending writers
router.get('/writers/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const writers = await User.find({ role: 'writer', isApproved: false });
    res.json(writers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve writer
router.post('/writers/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const writer = await User.findById(req.params.id);
    if (!writer) {
      return res.status(404).json({ message: 'Writer not found' });
    }

    writer.isApproved = true;
    await writer.save();

    res.json({ message: 'Writer approved successfully', writer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject writer
router.post('/writers/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Writer rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all requests
router.get('/requests', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const requests = await PoemRequest.find()
      .populate('patron', 'name email')
      .populate('writer', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get platform statistics
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalPatrons = await User.countDocuments({ role: 'patron' });
    const totalWriters = await User.countDocuments({ role: 'writer' });
    const approvedWriters = await User.countDocuments({ role: 'writer', isApproved: true });
    const totalRequests = await PoemRequest.countDocuments();
    const completedRequests = await PoemRequest.countDocuments({ status: 'delivered' });

    res.json({
      totalPatrons,
      totalWriters,
      approvedWriters,
      totalRequests,
      completedRequests,
      pendingRequests: totalRequests - completedRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
