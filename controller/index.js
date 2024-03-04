exports.main = (req, res) => {
    res.render('index');
};
exports.login = (req, res) => {
    res.render('login');
};
exports.signup = (req, res) => {
    res.render('signup');
};
exports.mypage = (req, res) => {
    res.render('mypage');
};
exports.checklist = (req, res) => {
    res.render('checklist');
};
exports.chat = (req, res) => {
    res.render('chat');
};
exports.map = (req, res) => {
    res.render('map');
};

exports.calendar = (req, res) => {
    res.render('calendar');
};

exports.triplist = (req, res) => {
    res.render('triplist');
};

exports.tripdetail = (req, res) => {
    res.render('tripdetail');
};
