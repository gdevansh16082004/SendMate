const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://gdevansh338:xd6OCPzkH9dJ1Dby@cluster0.pxi2nti.mongodb.net/paytm');

const User = mongoose.model('User', 
    {username: String,
     password: String,
     firstName : String,
     lastName: String
    }
)

const Accounts = mongoose.model('Accounts',
    {
        userId : {type : mongoose.Schema.Types.ObjectId ,
                  ref : "User",
                  required : true},
        balance : {type : Number,
                   required : true}
    }
)

const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  timestamp: { type: Date, default: Date.now },
  type: String // "credit" or "debit"
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { User, Accounts, Transaction };
