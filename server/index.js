const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');
const User = require('./user');
const Post = require('./posts');
const { Op } = require('sequelize');
const crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

sequelize.sync().then(() => console.log('Database is ready'));

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const fileName = generateRandomString(12) + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'super-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.post('/users', async (req, res) => {
  await User.create(req.body);
  res.send('User created');
});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

app.get('/users/profile', authenticateToken , async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({
      where: {
        id: userId
      }
    });

    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.put('/users/:email', async (req, res) => {
  const requestedEmail = req.params.email;
  const user = await User.findOne({ where: { email: requestedEmail } });
  user.username = req.body.username;
  await user.save();
  res.send('User updated');
});

app.delete('/users/:email', async (req, res) => {
  const requestedEmail = req.params.email;
  try {
    await User.destroy({ where: { email: requestedEmail } });
    res.send('User removed');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate the credentials against the db
    const user = await User.findOne({
      where: { email, password }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, 'super-secret');

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/posts', authenticateToken, upload.single('imageUrl'), async (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file ? req.file.path : '';

  try {
    const userId = req.user.userId;
    await Post.create({ title, content, imageUrl, userId });
    res.send('Post created');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.send(posts);
});

app.get('/posts/profile', async (req, res) => {
  try {
    const token = req.headers["authorization"].split(' ')[1];
    const decoded = jwt.verify(token, 'super-secret');

    if (!decoded.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const posts = await Post.findAll({
      where: {
        userId: decoded.userId
      }
    });
    if (posts.length > 0) {
      res.json(posts);
    } else {
      res.status(404).json({ error: 'No posts found for the user' });
    }
  } catch (error) {
    console.error('Error occurred while fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ where: { id: postId } });

  if (post) {
    res.send(post);
  } else {
    res.status(404).send({ error: 'Post not found' });
  }
});

app.put('/posts/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ where: { id: postId } });

  if (!post) {
    return res.status(404).send({ error: 'Post not found' });
  }

  const { title, content } = req.body;
  const imageUrl = req.file ? req.file.path : post.imageUrl;

  try {
    await post.update({ title, content, imageUrl });
    res.send('Post updated');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.delete('/posts/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;

  try {
    await Post.destroy({ where: { id: postId } });
    res.send('Post removed');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
