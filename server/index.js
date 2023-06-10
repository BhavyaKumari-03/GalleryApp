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
    const fileName = generateRandomString(12) + ".png";
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/users', async (req, res) => {
  await User.create(req.body);
  res.send('User created');
});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.send(users);
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
    const user = await User.findOne({
      where: { email, password }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'super-secret', { expiresIn: '1d' });

    res.json({ status: 'ok', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// Create a new post
app.post('/posts', upload.single('imageUrl'), async (req, res) => {
  const { title } = req.body;
  const token = req.headers['authorization'].split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'super-secret');
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await Post.create({
      title,
      //context,
      name: user.f_name,
      imageUrl: req.file.filename,
      userId: user.id,
    });

    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('An error occurred while creating the post');
  }
});

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['id', 'f_name', 'email'] }],

    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching Blog  posts:', error);
    res.status(500).send('An error occurred while fetching posts');
  }
});

app.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ where: { id: postId } });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/posts/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ where: { id: requestedPostId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.title = req.body.title;
    post.content = req.body.content;

    await post.save();

    res.send('Post updated');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send('An error occurred while updating the post');
  }
});

app.delete('/posts/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ where: { id: requestedPostId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Post.destroy({ where: { id: requestedPostId } });

    res.send('Post removed');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('An error occurred while deleting the post');
  }
});

app.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  res.sendFile(imagePath);
});

app.listen(3000, () => {
  console.log('App is running');
});