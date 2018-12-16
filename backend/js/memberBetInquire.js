var express = require('express');
var path = require("path");
var request = require('request');
var router = express.Router();

router.get('/memberBetInquireForm', function (req, res) {
    common.CreateHtml("memberBetInquireForm", req, res);
});

router.post('/MemberBetInquire_History', function (req, res) {
    var tempform = req.body;
    var Page = (tempform.start / tempform.length);
    var Limit = tempform.length;
    var BetLevel = [];
    var HallID = [];
    var DateRange = [];
    if (req.body.BetLevel != null)
        BetLevel = JSON.parse("[" + req.body.BetLevel + "]");

    if (req.body.HallID != null)
        HallID = JSON.parse("[" + req.body.HallID + "]");

    // if (req.body.Game[] != null)
    //     Game = JSON.parse("[" + req.body.Game + "]");

    if (req.body.DateRange != null)
        DateRange = JSON.parse("[" + req.body.DateRange + "]");

    var data = {
        MemberID: req.body.MemberID,
        Page: parseInt(Page),
        Limit: parseInt(Limit),
        Date: DateRange,
        BetLevel: BetLevel,
        HallID: HallID,
        GameID: tempform["Game[]"]
    };
    
    console.log(data);
    common.ChargeURL(function (url) {
        url = url + "/FindBetHistoryForBackend";
        request.post({ url, form: JSON.stringify(data) }, function (err, httpResponse, body) {
            if (err) {
                console.log("FindBetHistoryForBackend err : " + err);
                res.status(err).send();
                res.end();
                return;
            }
            var obj = JSON.parse(body);
            var totallength = obj.Max;
            var dbresults = [];
            if (obj.Data) {
                dbresults = obj.Data;
            }
            res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: dbresults });
            res.end();
        });
    });
});

module.exports = router;