const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const  User = require ("../user");
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user with hashed password
    const user = await User.create({
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user.id }, "super-secret");

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;