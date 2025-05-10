// routers/mainRouter.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authMiddleware = require('../0430_middlewares/authMiddleware'); // authMiddleware 가져오

const { 
  // 컨트롤러 쓸때
} = require('../0420_controllers/userController');

const router = express.Router();




// 로그인 페이지 렌더링
router.get('/', (req, res) => {
    res.render('index.ejs');
});

// 로그인 페이지 렌더링
router.get('/addition', (req, res) => {
    res.render('addition.ejs');
});


// 로그인 페이지 렌더링
router.get('/setting', (req, res) => {
    res.render('setting.ejs');
});

module.exports = router;