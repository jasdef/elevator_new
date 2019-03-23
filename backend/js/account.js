var express = require('express');
var path = require("path");
var router = express.Router();
var fs = require('fs');
var async = require('async');
var crypto = require('crypto');
var salt = "liton";

router.get('/AuthAdd', function (req, res) {
    common.log(req.session['account'], 'call AuthAdd');
    common.CreateHtml("AuthAdd", req, res);
});

router.get('/AuthList', function (req, res) {
    common.log(req.session['account'], 'call AuthList');
    common.CreateHtml("AuthList", req, res);
});

router.get('/AuthEdit', function (req, res) {
    common.log(req.session['account'], 'call AuthEdit');
    common.CreateHtml("AuthEdit", req, res);
});

router.post('/AddAuth', function (req, res) {
    common.CreateHtml("Auth_Transfer", req, res, function (err) {
        var hash = crypto.createHash('sha512');
        var pass = hash.update(req.body.password + salt).digest('hex');
        var tempForm = req.body;
        common.BackendConnection(res, function (err, connection) {
            var sql = "INSERT INTO account (account,password,name,autho,lock_status) VALUES (?,?,?,?,'N')";
            sql = connection.format(sql, [tempForm.Account, pass, tempForm.name, tempForm.AuthGroup]);
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

router.post('/GetAuthList', function (req, res) {
    common.CreateHtml("Customer_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from account;";
            var countSelect = "select COUNT(*) as count from account;";

   
            var sql = countSelect + dataSelect;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], err);
                    res.send({error : err});
                }
                else {
                    var totallength = result[0][0].count;
                    res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: result[1] });
                }
                connection.release();
                res.end();
            });

        });        
    });

});

router.post('/DeleteAuth', function (req, res) {
    common.CreateHtml("Auth_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var sql = "delete FROM account where id="  + connection.escape(req.body.Id);
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

router.post('/EditAuth', function (req, res) {
    common.CreateHtml("Auth_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var requestData = JSON.parse(req.body.requestData);

            var hash = crypto.createHash('sha512');
            var pass = hash.update(requestData.password + salt).digest('hex');

            var editAuthSQL = "update account set `account`=?, `password`=?, `name`=?, `autho`=?, `lock_status`=? where `id`=?;";

            var AuthData = 
            [
                requestData.account,
                pass,
                requestData.name,
                requestData.autho,
                requestData.lock_status,
                requestData.id
            ];
  
            editAuthSQL = connection.format(editAuthSQL, AuthData);

            var sql = editAuthSQL;

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "更新失敗", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "更新成功!" }).end();
                }
            });

        });
    });
});

module.exports = router;