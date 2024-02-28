const express = require('express');
const db = require('./models');
const app = express();
const PORT = 8000;

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

//404
app.get('*', (req, res) => {
    res.render('404');
});

db.sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
});
