const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./0300_config/db');
const mainRouter = require('./0100_routes/mainRouter');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// DB 연결
connectDB();

// JSON 요청 파싱
app.use(express.json());

// API 라우터 연결
app.use('/api', mainRouter);

// Vue 정적 파일 서비스
app.use(express.static(path.join(__dirname, '../tztodoapp/dist')));

// 루트 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../tztodoapp/dist/index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});