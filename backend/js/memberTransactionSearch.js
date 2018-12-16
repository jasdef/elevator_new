var express = require('express');
var path = require("path");
var router = express.Router();
var async = require("async");
var request = require('request');

router.get('/BulletinTransactionSearchForm', function (req, res) {
    common.log(req.session['account'], 'call BulletinTransactionSearchForm');
    common.CreateHtml("BulletinTransactionSearchForm", req, res);
});

router.post('/MemberTransactionSearch', function (req, res) {
    var data = {};
    data["memberId"] = req.body.MemberId;
    data["action"] = "GetByAll";
    
    common.CommonURL(function (url) {
        url = url + "/TransactionService/TransactionDataRequest";
        var options = {
          uri: url,
          method: 'POST',
          json: {
            "memberId": req.body.MemberId,
            "action": "GetByAll"
          }
        };
        
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                res.send({ data: JSON.stringify(body) });
            } else {
                res.send({ code: -1 });
            }
            res.end();
        });
    });
});

module.exports = router;