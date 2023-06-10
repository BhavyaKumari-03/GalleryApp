const express = require('express');
const Post = require('../posts')
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      //context: req.body.context,
      imageUrl: req.body.imageUrl,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error Not posted ' });
  }
});

module.exports = router;