var express = require('express');
var path = require("path");
var router = express.Router();

router.get('/BulletinMarqueeForm', function (req, res) {
    common.log(req.session['account'], 'call BulletinMarqueeForm');
    common.CreateHtml("BulletinMarqueeForm", req, res);
});


router.post('/GetMarquee', function (req, res) {
    common.SCGConnection(res, function (err, connection) {
        if (err) throw err;
        var sql = "SELECT * FROM Marquee";

        connection.query(sql, function (error, dbresults, fields) {
            connection.release();
            if (error) throw error;
            res.send({ data: dbresults });
            res.end();
        });
    });
});

router.post('/MarqueeEnable', function (req, res) {
    var tempForm = req.body;
    if(tempForm.Id==""){
      res.send({ code : "-1", msg : "Id有誤" });
      res.end();
    }

    common.SCGConnection(res, function(err, connection) {
        if (err) throw err;
        var sql = "UPDATE `Marquee` SET `Open` = ? WHERE `Id` = ?;";
        var updateData = [req.body.Open, req.body.Id];
        var query = connection.query(sql, updateData, function(err, result) {
            if (err) {
                res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
            } else {
                res.send({ code: "0", result: result });
            }
            connection.release();
            res.end();
        });
        common.log(req.session['account'], query.sql);
    });
});

router.post('/MarqueeAdd', function (req, res) {
    var tempForm = req.body;
    console.dir(tempForm);
    common.SCGConnection(res, function(err, connection) {
        if (err) {
            res.send({ code: "-1", msg: "連線失敗" });
            res.end();
        }

        var sql = "INSERT INTO `Marquee` SET ?"; // 上傳後要更新的資料表
        connection.query(sql, tempForm, function(err, result) {
            if (err) {
                throw err;
                res.send({ code: "-1", msg: "新增失敗" });
            } else {
                res.send({ code: "0", msg: "新增成功:" + result.affectedRows });
            }
            connection.release();
        });
    });
});

router.post('/MarqueeModify', function (req, res) {
    var tempForm = req.body;

    if(tempForm.Id==""){
      res.send({ code : "-1", msg : "Id有誤" });
      res.end();
    }

    common.SCGConnection(res, function (err, connection) {
        if (err){
            res.send({ code : "-1", msg : "連線失敗" });
            res.end();
        }
        connection.query('UPDATE JCGGame.Marquee SET ? WHERE Id = ?', [tempForm, tempForm.Id], function (err, result) {
            if (err){
                throw err;
                res.send({ code : "-1", msg : "修改失敗" });
            }else{
                res.send({ code : "0", msg : "修改成功:"+result.affectedRows});
            }
            connection.release();
            res.end();
        });
    });
});

router.post('/MarqueeDel', function (req, res) {
    var tempForm = req.body;

    if(tempForm.Id==""){
      res.send({ code : "-1", msg : "Id有誤" });
      res.end();
    }

    common.SCGConnection(function (err, connection) {
        if (err){
            res.send({ code : "-1", msg : "連線失敗" });
            res.end();
        }
        connection.query('DELETE FROM JCGGame.Marquee WHERE Id = ?', [tempForm.Id], function (err, result) {
            if (err){
                throw err;
                res.send({ code : "-1", msg : "刪除失敗" });
            }else{
                res.send({ code : "0", msg : "刪除成功:"+result.affectedRows});
            }
            connection.release();
            res.end();
        });
    });
});

module.exports = router;