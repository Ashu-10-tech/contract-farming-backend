const express = require('express');
const jwt = require('jsonwebtoken');
const Tender = require('../models/Tender');
const router = express.Router();

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

router.post('/tenders', verifyToken, async (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Only companies can upload tenders' });
  const tender = new Tender({ ...req.body, postedBy: req.user.userId });
  await tender.save();
  res.json({ message: 'Tender uploaded' });
});

router.get('/tenders', async (req, res) => {
  const tenders = await Tender.find().populate('postedBy', 'username');
  res.json(tenders);
});

router.post('/tenders/:id/bid', verifyToken, async (req, res) => {
  if (req.user.role !== 'farmer') return res.status(403).json({ error: 'Only farmers can bid' });
  const tender = await Tender.findById(req.params.id);
  tender.bids.push({ farmer: req.user.userId, amount: req.body.amount });
  await tender.save();
  res.json({ message: 'Bid submitted' });
});

module.exports = router;