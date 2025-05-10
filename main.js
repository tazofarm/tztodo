const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // path 모듈을 추가합니다.
const flash = require('connect-flash'); // 플래시 미들웨어 추가
const http = require('http');  // http 모듈 추가
const socketIo = require('socket.io'); // Socket.IO 추가

// dotenv 설정 - 이 부분을 맨 상단에 추가
require('dotenv').config();


const mainRouter = require('./0410_routes/mainRouter');



const app = express();
const PORT = process.env.PORT || 3000;

// HTTP 서버 생성
const server = http.createServer(app);
const io = socketIo(server); // Socket.IO 서버 초기화

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '0200_public')));

// 기본 이미지용
app.use('/images', express.static(path.join(__dirname, '0200_public/images')));

// 업로드된 이미지용
app.use('/uploads', express.static(path.join(__dirname, '0200_public/uploads')));


// EJS 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '0100_views')); // EJS 템플릿 경로 설정



// 미들웨어 설정
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 세션 설정
app.use(session({
    secret: 'tztz',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS에서만 유효한 쿠키 설정: 개발 중에는 false로 유지
}));

// 라우터 설정
app.use('/', mainRouter);




// 서버 시작
server.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});