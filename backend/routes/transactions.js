const express = require('express');
const { authMiddleWare } = require('../middleware');
const { Transaction, User } = require('../db');
const router = express.Router();

const mongoose = require("mongoose");
// const Transaction = require("../models/Transaction"); // make sure you import this correctly
// const User = require("../models/User");

router.get('/history', authMiddleWare, async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      $or: [
        { from: req.userId },
        { to: req.userId }
      ]
    })
      .sort({ timestamp: -1 })
      .populate('from', 'firstName lastName')
      .populate('to', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit));

    const formatted = transactions.map(txn => {
      const isDebit = txn.from._id.toString() === req.userId;
      return {
        _id: txn._id,
        fromUserId: txn.from._id,
        toUserId: txn.to._id,
        fromUserDetails: {
          firstName: txn.from.firstName,
          lastName: txn.from.lastName
        },
        toUserDetails: {
          firstName: txn.to.firstName,
          lastName: txn.to.lastName
        },
        type: isDebit ? "debit" : "credit",
        amount: txn.amount,
        timestamp: txn.timestamp
      };
    });

    const totalCount = await Transaction.countDocuments({
      $or: [{ from: req.userId }, { to: req.userId }]
    });

    res.json({
      transactions: formatted,
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transaction history" });
  }
});


module.exports = router;