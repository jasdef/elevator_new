var express = require('express');
var path = require("path");
var router = express.Router();

router.get('/MemberGroupManualForm', function (req, res) {
    common.log(req.session['account'], 'call MemberGroupManualForm');
    common.CreateHtml("MemberGroupManualForm", req, res);
});


router.post('/GroupManual_info', function (req, res) {
    common.CreateHtml("GroupManual_info", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            if (err) throw err;
            var sql = "SELECT aa.*, ifnull(bb.cnt, 0) AS cnt From JCGGame.Audience aa JOIN (SELECT IFNULL(AudienceId, " + req.body.AudienceId + ") AS AudienceId, COUNT(MemberId) AS cnt FROM JCGGame.MemberAudience where AudienceId=" + req.body.AudienceId +") bb ON  aa.Id = bb.AudienceId";
            //sql = connection.format(sql, req.body.AudienceId, req.body.AudienceId);
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

router.post('/GroupManual_List', function (req, res) {
    common.CreateHtml("GroupManual_List", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var sql = "SELECT * FROM JCGGame.MemberAudience a JOIN (SELECT MemberId,NickName,Name,Email FROM JCGGame.Member) b on a.MemberId = b.MemberId where AudienceId=?";
            sql = connection.format(sql, req.body.AudienceId);
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

router.post('/GroupManual_Delete', function (req, res) {
    common.CreateHtml("GroupManual_Delete", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var sql = "DELETE FROM JCGGame.MemberAudience WHERE MemberId=? AND AudienceId=?";
            sql = connection.format(sql, [req.body.MemberId, req.body.AudienceId]);
            common.log(req.session['account'], sql);
            connection.query(sql, function (error, dbresults, fields) {
                if (error) throw error;
                connection.release();
                if (err) {
                    res.send({ code: "-1", msg: "失敗" });
                } else {
                    res.send({ code: "0", msg: "成功" });
                }
                res.end();
            });
        });
    });
});

module.exports = router;