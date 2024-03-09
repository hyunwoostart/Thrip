const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const db = require('./models');

const app = express();
const PORT = 8000;
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

// 라우터
const indexRouter = require('./routes');
app.use('/', indexRouter);
const memberRouter = require('./routes/member');
app.use('/api/member', memberRouter);
const scheduleRouter = require('./routes/schedule');
app.use('/api/schedule', scheduleRouter);
const recommendRouter = require('./routes/recommend');
app.use('/api/recommend', recommendRouter);

// 소켓
io.on('connection', (socket) => {
    // 채팅방 입장
    socket.on('enter', (res) => {
        const { roomId } = res;
        socket.join(roomId);
        socket.roomId = roomId;
    });
    // 채팅 입력
    socket.on('msg', (res) => {
        const { chatMsg, userId, username } = res;
        io.to(socket.roomId).emit('newMsg', {
            chatMsg,
            userId,
            username,
            roomId: socket.roomId,
        });
    });
});

//404
app.get('*', (req, res) => {
    res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
});
