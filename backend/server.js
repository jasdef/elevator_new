var express = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
var fs = require('fs');
var https = require('https');

common = require("./js/common");


var loginform = require('./js/login');
var notification = require('./js/notification');
var account = require('./js/account');
var transaction = require('./js/transaction');
var modifyProject = require('./js/modifyProject');
var warranty = require('./js/warranty');
var customer = require('./js/customer');
var dispatch = require('./js/dispatch');
var service = require('./js/service');
var elevator = require('./js/elevator');
var fixForm = require('./js/fixForm');
var imgUpload = require('./js/uploadImg');
var staff = require('./js/staff');
var historyRecord = require('./js/historyRecordSearch');
var listenPort = 8888;
var key = fs.readFileSync('certificate/ca.key', 'utf8');
var cert = fs.readFileSync('certificate/ca.crt', 'utf8');

var options = {
    key: key,
    cert: cert
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb', uploadDir: './uploads' }));
app.use(cookieParser());


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 * 50 }
}));
app.use(account);
app.use(dispatch);
app.use(customer);
app.use(service);
app.use(imgUpload);
app.use(loginform);
app.use(notification);
app.use(transaction);
app.use(modifyProject);
app.use(fixForm);
app.use(warranty);
app.use(historyRecord);
app.use(staff);
app.use(elevator);
app.get('/', function (req, res) {
    if (typeof (req.session['account']) === "undefined") {
        res.redirect('/LoginForm');
    } else {
        res.redirect('/MemberSearchForm');
    }
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/' + req.url).split("?")[0]);
});

https.createServer(options, app).listen(listenPort,'0.0.0.0', function () {
    console.log("Express server listening on port " + listenPort);
    fs.readFile(__dirname + '/package.json', 'utf8', function (err, data) {
        console.log("version: " + JSON.parse(data).version);
    });
});