var express = require('express');
var path = require("path");
var router = express.Router();
var fs = require('fs');
var async = require('async');
var crypto = require('crypto');
var salt = "jumbo.net";

router.get('/AuthUser', function (req, res) {
    common.log(req.session['account'], 'call AuthUser');
    common.CreateHtml("AuthUser", req, res);
});

router.post('/AuthUser_add', function (req, res) {
    common.CreateHtml("AuthUser_add", req, res, function (err) {
        var hash = crypto.createHash('sha512');
        var pass = hash.update(req.body.password + salt).digest('hex');
        var tempForm = req.body;
        common.BackendConnection(res, function (err, connection) {
            var sql = "INSERT INTO backend.Account (account,password,AuthGroupId,mail,IP,LockStatus,NickName) VALUES (?,?,?,?,?,'N',?)";
            sql = connection.format(sql, [tempForm.Account, pass, tempForm.AuthGroup, tempForm.mail, tempForm.IP, tempForm.Name]);
            common.log(req.session['account'], sql);
            connection.query(sql, function (err, dbresults, fields) {
                if (err) {
                    throw err;
                    res.send({ code: "-1", msg: "失敗" });
                } else {
                    res.send({ code: "0", msg: "成功", data: dbresults });
                }
                connection.release();
                res.end();
            });
        });
    });
});

router.post('/AuthUser_info', function (req, res) {
    common.CreateHtml("AuthUser_info", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "SELECT idAccount,account,NickName,mail,AuthGroupId,LockStatus,IP FROM backend.Account ";
            if (req.body.ID != null) {
                sql = sql + "where account like " + connection.escape("%" + req.body.ID + "%");
            }
            if (req.body.Name != null && req.body.ID != null) {
                sql = sql + "AND NickName like " + connection.escape("%" + req.body.Name + "%");
            }
            if (req.body.Name != null && req.body.ID == null) {
                sql = sql + "where NickName like " + connection.escape("%" + req.body.Name + "%");
            }

            common.log(req.session['account'], sql);
            connection.query(sql, function (err, dbresults, fields) {
                if (err) {
                    throw err;
                    res.send({ code: "-1", msg: "失敗" });
                } else {
                    res.send({ code: "0", msg: "成功", data: dbresults });
                }
                connection.release();
                res.end();
            });
        });
    });
});

router.post('/AuthUser_delete', function (req, res) {
    common.CreateHtml("AuthUser_delete", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "delete FROM backend.Account where idAccount="  + connection.escape(req.body.Id);
            common.log(req.session['account'], sql);
            connection.query(sql, function (err, dbresults, fields) {
                if (err) {
                    throw err;
                    res.send({ code: "-1", msg: "刪除失敗" });
                } else {
                    res.send({ code: "0", msg: "刪除成功" });
                }
                connection.release();
                res.end();
            });
        });
    });
});

router.post('/AuthUser_Modify', function (req, res) {
    common.CreateHtml("AuthUser_Modify", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var hash = crypto.createHash('sha512');
            var pass = hash.update(req.body.password + salt).digest('hex');
            var sql = "update backend.Account set password = '" + pass + "',AuthGroupId = '" + req.body.AuthGroup +
                "',mail = '" + req.body.mail + "',IP = '" + req.body.IP + "' where idAccount = '" + req.body.id+"'";
            common.log(req.session['account'], sql);
            connection.query(sql, function (err, dbresults, fields) {
                if (err) {
                    throw err;
                    res.send({ code: "-1", msg: "刪除失敗" });
                } else {
                    res.send({ code: "0", msg: "刪除成功" });
                }
                connection.release();
                res.end();
            });

        });
    });
});

module.exports = router;