const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

// Models
const User = mongoose.model('User', {
  username: String,
  password: String,
  firstName: String,
  lastName: String
});

const Accounts = mongoose.model('Accounts', {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});

const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  timestamp: { type: Date, default: Date.now },
  type: String
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = {
  connectDB,
  User,
  Accounts,
  Transaction
};
