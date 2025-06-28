const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mainRouter = require('./routes/index');
const { connectDB } = require('./db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', mainRouter);

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
