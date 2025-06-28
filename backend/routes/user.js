const { signin, signup, updateInformation } = require('./types');
const { User, Accounts } = require('../db');
const { JWT_SECRET } = require('../config');
const { authMiddleWare } = require('../middleware');

const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router();

router.post('/signup', async function (req, res, next) {
    const signupData = req.body;
    const parsedsignupData = signup.safeParse(signupData)

    if (!parsedsignupData.success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: signupData.username
    })
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const user = await User.create({
        username: signupData.username,
        password: signupData.password,
        firstName: signupData.firstName,
        lastName: signupData.lastName
    })
    
    const userId = user._id;
    const account = await Accounts.create({
        userId,
        balance : 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET,{ expiresIn: '3h' });

    res.json({
        message: "Signup successful",
        token: token
    })


})


router.post('/signin', async function (req, res, next) {
    const signinData = req.body;
    const parsedsigninData = signin.safeParse(signinData);

    if (!parsedsigninData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: signinData.username,
        password: signinData.password
    })

    if (user) {
        const userId = user._id
        const token = jwt.sign({
            userId
        }, JWT_SECRET,{ expiresIn: '3h' })

        return res.json({
            token: token
        })
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})

router.put('/', authMiddleWare, async function (req, res, next) {
    const updatedInformation = req.body;
    const parsedupdatedInformation = updateInformation.safeParse(updatedInformation)

    if (!parsedupdatedInformation.success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, updatedInformation)

    res.json({
        message: "Updated successfully"
    })
})


router.get('/bulk', async function (req, res, next) {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: { "$regex" : filter }
        },
        {
            lastName: { "$regex" : filter }
        }]
    })

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id : user._id
        }))
    })
})

router.get('/me', authMiddleWare, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username firstName lastName');
    if (!user) return res.status(404).json({ message: "User not found" });

    const account = await Accounts.findOne({ userId: req.userId });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: account?.balance || 0
      }
    });
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/check-auth', authMiddleWare, async (req, res) => {
    res.json({ ok: true });
});


module.exports = router;