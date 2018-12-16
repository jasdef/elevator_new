var express = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var session = require('express-session');
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var app = express();
var fs = require('fs');
var https = require('https');


common = require("./js/common");
timer = require("./js/timer");

// clearAllToken = require('./js/clearAllToken');

var loginform = require('./js/login');


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
app.use(fileUpload({
	limits: { fileSize: 2 * 1024 * 1024 }, //­ ­設定檔案大小限制2MB
}));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 * 50 }
}));

app.use(loginform);

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