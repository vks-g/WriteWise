require('module-alias/register');

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('@/routes/auth.routes');
const postRoutes = require('@/routes/post.routes');
const commentRoutes = require('@/routes/comment.routes');
const likeRoutes = require('@/routes/like.routes');
const aiRoutes = require('@/routes/ai.routes');
const userRoutes = require('@/routes/user.routes');

const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);
app.use('/ai', aiRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Writewise Blog Backend is running');
});

const PORT = process.env.PORT || 8888;
// const PORT = 8888
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
