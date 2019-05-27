var express = require('express');
var path = require("path");
var router = express.Router();
var fileUpload = require('express-fileupload');
var async = require('async');
var request = require('request');

router.get('/Notification', function(req, res) {
    common.log(req.session['account'], 'call Notification');
    common.CreateHtml("Notification", req, res);
});



module.exports = router;