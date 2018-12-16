var express = require('express');
var path = require("path");
var router = express.Router();
var async = require("async");

router.get('/MemberGroupForm', function (req, res) {
    common.log(req.session['account'], 'call MemberGroupForm');
    common.CreateHtml("MemberGroupForm", req, res);
});


router.post('/MemberGroup', function (req, res) {
    common.CreateHtml("MemberGroup", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var sql = "SELECT aa.*, ifnull(bb.cnt,0) AS cnt "
                + "From JCGGame.Audience aa LEFT JOIN ( "
                + "SELECT AudienceId, COUNT(MemberId) AS cnt "
                + "FROM JCGGame.MemberAudience "
                + "GROUP BY AudienceId "
                + ") bb ON  aa.Id = bb.AudienceId";

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, dbresults, fields) {
                connection.release();
                if (error) throw error;
                res.send({ data: dbresults });
                res.end();
            });
        });
    });
});

router.post('/MemberGroupAdd', function (req, res) {
    common.CreateHtml("MemberGroupAdd", req, res, function (err) {
        var tempForm = req.body;
        common.SCGConnection(res, function (err, connection) {
            var sql = "INSERT INTO JCGGame.Audience SET ? ";
            sql = connection.format(sql, tempForm);
            common.log(req.session['account'], sql);
            connection.query(sql, function (err, result) {
                if (err) {
                    res.send({ code: "-1", msg: "新增失敗" });
                } else {
                    res.send({ code: "0", msg: "新增成功:" + result.affectedRows, insertId: result.insertId });
                }
                connection.release();
                res.end();
            });
        });
    });
});

router.post('/MemberGroupDelete', function (req, res) {
    common.CreateHtml("MemberGroupDelete", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var done = true;
            var sqls = ["delete FROM JCGGame.MemberAudience where AudienceId=?;",
                "delete FROM JCGGame.Audience where Id=?;"];

            async.each(sqls, function (sql, callback) {
                sql = connection.format(sql, req.body.Id);
                common.log(req.session['account'], sql);
                connection.query(sql, function (err, result) {
                    if (err) {
                        res.send({ code: "-1", msg: "刪除失敗" });
                        res.end();
                        common.log('system', err);
                    }
                    else {
                        callback();
                    }
                });
            }, function (err) {
                connection.release();
                if (err) {
                    res.send({ code: "-1", msg: "刪除失敗" });
                    common.log('system', err);
                }
                else {
                    res.send({ code: "0", msg: "刪除成功" });
                }
                res.end();
            });

        });
    });
});

router.post('/MemberGroupModify', function (req, res) {

    common.CreateHtml("MemberGroupModify", req, res, function (err) {
        var tempForm = req.body;
        if (tempForm.Id == "") {
            res.send({ code: "-1", msg: "Id有誤" });
            res.end();
        }
        common.SCGConnection(res, function (err, connection) {
            var sql = "UPDATE JCGGame.Audience SET ? WHERE Id = ?";
            sql = connection.format(sql, [tempForm, tempForm.Id]);
            common.log(req.session['account'], sql);
            connection.query('UPDATE JCGGame.Audience SET ? WHERE Id = ?', [tempForm, tempForm.Id], function (err, result) {
                if (err) {
                    throw err;
                    res.send({ code: "-1", msg: "修改失敗" });
                } else {
                    res.send({ code: "0", msg: "修改成功:" + result.affectedRows });
                }
                connection.release();
                res.end();
            });
        });
    });
});

module.exports = router;