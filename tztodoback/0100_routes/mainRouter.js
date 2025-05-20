const express = require('express');
const router = express.Router();
const User = require('../0200_models/User');

// 모든 유저 조회
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 유저 추가
router.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  const saved = await newUser.save();
  res.json(saved);
});

module.exports = router;