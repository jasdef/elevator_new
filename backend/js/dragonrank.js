var express = require('express');
var path = require("path");
var http = require("http");
var https = require("https");
var url = require('url');
var request = require('request');
var router = express.Router();

router.get('/DragonRankForm', function (req, res) {
    common.CreateHtml("DragonRankForm", req, res);
});


router.post('/DragonRank', function (req, res) {
    common.CreateHtml("DragonRank", req, res, function (err) {
        if (err) {
            res.status(err).send();
            res.end();
            return;
        }
        common.SCGConnection(function (err, connection) {
            if (err) throw err;
            connection.query("SELECT * FROM SCGGame.DragonTigerRewardHistory WHERE Type='Dragon' AND Region = ?", [req.body.Region], function (error, dbresults, fields) {
                connection.release();
                if (error) throw error;
                res.send({ data: dbresults });
                res.end();
            });
        });
    });
});

router.post('/DragonRank_History', function (req, res) {
    common.CreateHtml("DragonRank_History", req, res, function (err) {
        if (err) {
            res.status(err).send();
            res.end();
            return;
        }

        var urlstr = 'http://localhost.jumbo-slots.com:8080/GetMemberRankInfo';
        var options = {
            url: urlstr,
            method: 'POST',
            form: { 'MemberId': req.body.MemberId, 'StartDate': req.body.StartDate, 'EndDate': req.body.EndDate },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        request(options, function (err, response, body) {
            if (err) throw err;

            if (response.statusCode == 200) {
                console.log(body);
                res.send({ data: body });
                res.end();
            } else {
                res.send({ data: err });
                res.end();
            }
        })

        // common.SCGConnection(function (err, connection) {
        //     if (err) throw err;
        //     //connection.query("SELECT * FROM SCGGame.DragonTigerRewardHistory WHERE MemberId = ? AND ModifyTime >= ? AND ModifyTime <= ?", [req.body.MemberId, req.body.StartDate, req.body.EndDate], function (error, dbresults, fields) {
        //     connection.query(
        //         "SELECT " +
        //             "`a`.`Id` AS `Id`, " +
        //             "`a`.`ModifyTime` AS `ModifyTime`, " +
        //             "`a`.`Tag` AS `Tag`, " +
        //             "`a`.`Type` AS `Type`, " +
        //             "`a`.`Region` AS `Region`, " +
        //             "`a`.`Rank` AS `Rank`, " +
        //             "`a`.`Score` AS `Score`, " +
        //             "`a`.`Reward` AS `Reward`, " +
        //             "`a`.`MemberId` AS `MemberId`, " +
        //             "`a`.`MemberGamePlayHistoryId` AS `MemberGamePlayHistoryId`, " +
        //             "`a`.`Mag` AS `Mag`, " +
        //             "`b`.`MemberName` AS `MemberName`, " +
        //             "`c`.`SCGGameId` AS `SCGGameId` " +
        //         "FROM " +
        //             "`SCGGame`.`DragonTigerRewardHistory` `a` " +
        //             "JOIN `SCGGame`.`Member` `b` ON ((`a`.`MemberId` = `b`.`MemberId`)) " +
        //             "JOIN `SCGGame`.`DragonTigerRanking` `c` ON ((`a`.`MemberGamePlayHistoryId` = `c`.`MemberGamePlayHistoryId`)) " +
        //             "WHERE `a`.`MemberId`=? AND `a`.`ModifyTime` >= ? AND `a`.`ModifyTime` <= ?"
        //         ,[req.body.MemberId, req.body.StartDate, req.body.EndDate], function (error, dbresults, fields) {
        //             connection.release();
        //             if (error) throw error;
        //             res.send({ data: dbresults });
        //             res.end();
        //     });
        // });
    });
});

module.exports = router;