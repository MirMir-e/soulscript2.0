const express = require('express');
const authMiddleware = require('../middleware/auth');
const PoemRequest = require('../models/PoemRequest');
const User = require('../models/User');

const router = express.Router();

// Create poem request (Patrons)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'patron') {
      return res.status(403).json({ message: 'Only patrons can create requests' });
    }

    const { topic, description, poemType, pages, deliveryRequired, deliveryDate } = req.body;
    const chargeAmount = pages * 100; // 100 KSH per page

    const request = new PoemRequest({
      patron: req.userId,
      topic,
      description,
      poemType,
      pages,
      chargeAmount,
      deliveryRequired,
      deliveryDate: deliveryRequired ? deliveryDate : null
    });

    await request.save();

    res.status(201).json({
      message: 'Request created successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patron's requests (only their own)
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'patron') {
      return res.status(403).json({ message: 'Only patrons can view their requests' });
    }

    const requests = await PoemRequest.find({ patron: req.userId })
      .populate('writer', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available requests (Writers)
router.get('/available', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'writer') {
      return res.status(403).json({ message: 'Only writers can view available requests' });
    }

    const requests = await PoemRequest.find({ status: 'pending' })
      .populate('patron', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign request to writer
router.post('/:id/assign', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'writer') {
      return res.status(403).json({ message: 'Only writers can accept requests' });
    }

    const request = await PoemRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer available' });
    }

    request.writer = req.userId;
    request.status = 'assigned';
    await request.save();

    res.json({
      message: 'Request assigned to you',
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get writer's assigned requests
router.get('/my-assignments', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'writer') {
      return res.status(403).json({ message: 'Only writers can view assignments' });
    }

    const requests = await PoemRequest.find({ writer: req.userId })
      .populate('patron', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
