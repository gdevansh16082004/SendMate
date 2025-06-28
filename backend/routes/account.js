const express = require('express');
const { authMiddleWare } = require('../middleware');
const { transformer } = require('zod');
const { transferDetails } = require('./types');
const { Accounts } = require('../db');
const { Transaction } = require('../db');
const { default: mongoose } = require('mongoose');
const router = express.Router();

router.get('/balance', authMiddleWare,async function(req,res,next){
     const account = Accounts.findOne({
        userId : req.userId
     })
     
     res.json({
        balance : account.balance
     })
})

router.post('/transfer', authMiddleWare, async (req, res) => {
    const parsed = transferDetails.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid transfer data" });

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const senderAccount = await Accounts.findOne({ userId: req.userId }).session(session);
        if (!senderAccount || senderAccount.balance < req.body.amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const receiverAccount = await Accounts.findOne({ userId: req.body.to }).session(session);
        if (!receiverAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Receiver not found" });
        }

        await Accounts.updateOne({ userId: req.userId }, { $inc: { balance: -req.body.amount } }).session(session);
        await Accounts.updateOne({ userId: req.body.to }, { $inc: { balance: req.body.amount } }).session(session);

        await Transaction.create([
            {
                from: req.userId,
                to: req.body.to,
                amount: req.body.amount,
                type: "debit"
            },
            {
                from: req.userId,
                to: req.body.to,
                amount: req.body.amount,
                type: "credit"
            }
        ], { session });

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transfer failed", error: err.message });
    } finally {
        session.endSession();
    }
});



module.exports = router;