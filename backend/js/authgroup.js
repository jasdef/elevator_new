var express = require('express');
var path = require("path");
var router = express.Router();
var fs = require('fs');
var async = require('async');

router.get('/AuthGroup', function (req, res) {
    common.log(req.session['account'], 'call AuthGroup');
    common.CreateHtml("AuthGroup", req, res);
});

router.post('/AuthGroup_add', function (req, res) {
    common.CreateHtml("AuthGroup_add", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "INSERT INTO backend.AuthGroup (AuthGroupName, AuthGroupDescription) VALUES";
            sql = sql + "(" + connection.escape(req.body.AuthGroupName) + "," + connection.escape(req.body.AuthGroupDescription) + ")";
            common.log(req.session['account'], sql);
            connection.query(sql, function (err, dbresults, fields) {
                if (err) {
                    throw err;
                    res.send({ code: "-1", msg: "新增失敗" });
                } else {
                    res.send({ code: "0", msg: "新增成功" });
                }
                connection.release();
                res.end();
            });
        });
    });
});

router.post('/AuthGroup_info', function (req, res) {
    common.CreateHtml("AuthGroup_info", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "SELECT * FROM backend.AuthGroup";
            common.log(req.session['account'], sql);
            connection.query(sql, function (err, dbresults, fields) {
                if (err) {
                    common.log(req.session['account'], err);
                    return;
                };
                var totallength = dbresults.length;
                sql = "SELECT * FROM (SELECT  idAuthGroup, GROUP_CONCAT(account SEPARATOR ', ') as Member FROM (SELECT * FROM backend.AuthGroup LEFT JOIN backend.Account ON idAuthGroup=AuthGroupId) a group by a.idAuthGroup) b LEFT JOIN backend.AuthGroup c ON b.idAuthGroup=c.idAuthGroup LIMIT " + req.body.start + ", " + req.body.length;
                common.log(req.session['account'], sql);
                connection.query(sql, function (err, dbresults, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: dbresults });
                    res.end();
                });
            });
        });
    });
});

router.post('/AuthGroup_delete', function (req, res) {
    common.CreateHtml("AuthGroup_delete", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "delete FROM backend.AuthGroup where idAuthGroup=?";
            sql = connection.format(sql, req.body.Id);
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

router.post('/AuthGroup_Modify', function (req, res) {
    common.CreateHtml("AuthGroup_Modify", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "UPDATE backend.AuthGroup SET AuthGroupName = ? ,AuthGroupDescription = ? WHERE idAuthGroup = ?";
            var editData = [req.body.AuthGroupName, req.body.AuthGroupDescription, req.body.idAuthGroup];
            sql = connection.format(sql, editData);
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

router.post('/AuthGroup_list', function (req, res) {
    common.CreateHtml("AuthGroup_list", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "SELECT * FROM backend.AuthGroup";
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

module.exports = router;