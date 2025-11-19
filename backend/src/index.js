require('module-alias/register');

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');

const authRoutes = require('@/routes/auth.routes');


const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Writewise Blog Backend is running');
});

const PORT = process.env.PORT || 8888;
// const PORT = 8888
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;