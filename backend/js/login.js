var express = require('express');
var path = require("path");
var router = express.Router();
var crypto = require('crypto');
var salt = "liton";
var async = require("async");

router.get('/LoginForm', function (req, res) {
    res.sendFile(path.join(__dirname + './../public/login.html'));
});

router.get('/ChangePasswordForm', function (req, res) {
    res.sendFile(path.join(__dirname + './../public/changepassword.html'));
});

router.post('/SCGBackendLogin', function (req, res) {
    common.BackendConnection(res, function (err, connection) {
        connection.query("SELECT * FROM account where account=?", [req.body.Username], function (error, dbresults, fields) {
            connection.release();
            if (error) throw error;
            if (dbresults.length == 1) {
                async.waterfall([
                    function (callback) {
                        CheckIP(req, res, dbresults[0], function () {
                            callback();
                        });
                    }, function (callback) {
                        CheckErrorStatus(req, res, dbresults[0], function () {
                            callback();
                        });
                    }
                ], function (err, result) {
                    var hash = crypto.createHash('sha512');
                    var pass = hash.update(req.body.Password + salt).digest('hex');
                    if (dbresults[0].password == pass) {
                        res.cookie('Account', req.body.Username, { maxAge: 900000 });
                        var deadline = new Date(dbresults[0].PasswordModifyTime);
                        if (Date.now() > deadline) {
                            res.send({ code: '0', html: 'ChangePasswordForm', account: req.body.Username });
                            res.end();
                        } else {
                            common.log("system", req.body.Username + ': login OK');
                            req.session['account'] = req.body.Username;
                            req.session['autho'] = dbresults[0].autho;
                            res.send({ code: '0', html: 'Notification', account: req.body.Username });
                            res.end();
                            common.BackendConnection(res, function (err, connection) {
                                connection.query("update backend.Account SET Error = 0 where idAccount=?;", [dbresults[0].idAccount], function (error, dbresults, fields) {
                                    connection.release();
                                });
                            });
                        }
                    } else {
                        common.log("system", req.body.Username + ':　login ERROR');
                        res.send({ code: '0', account: "null" });
                        res.end();
                        if (dbresults[0].Error >= 3) {
                            if (dbresults[0].Error >= 19) {
                                common.BackendConnection(res, function (err, connection) {
                                    connection.query("SELECT mail FROM backend.Account where AuthGroupId=1;", function (error, dbresults, fields) {
                                        connection.release();
                                        var mess = req.body.Username + " Password Error Over 20";
                                        dbresults.forEach(function (user) {
                                            common.SendMail(user.mail, mess);
                                        });
                                        common.BackendConnection(res, function (err, connection) {
                                            connection.query("update backend.Account SET Error = Error + 1,LockStatus='Y' where idAccount=?;", [dbresults[0].idAccount], function (error, dbresults, fields) {
                                                connection.release();
                                            });
                                        });
                                    });
                                });
                            } else {
                                var now = new Date();
                                now.setMinutes(now.getMinutes() + 5);
                                common.BackendConnection(res, function (err, connection) {
                                    connection.query("update backend.Account SET Error = Error + 1,LockTime=? where idAccount=?;", [now, dbresults[0].idAccount], function (error, dbresults, fields) {
                                        connection.release();
                                    });
                                });
                            }
                        }
                        else {
                            common.BackendConnection(res, function (err, connection) {
                                connection.query("update backend.Account SET Error = Error + 1 where idAccount=?;", [dbresults[0].idAccount], function (error, dbresults, fields) {
                                    connection.release();
                                });
                            });
                        }
                    }
                });
            } else {
                common.log("system", req.body.Username + ': Account not only');
                res.send({ code: '-1', msg: "Account not only" });
                res.end();
            }
        });
    });
});

function CheckIP(req, res, UserInfo, callback) {
    var isIP = false;

    isIP = true;
    callback();
    return;
    // IPs = UserInfo.IP.split(";");
    // IPs.forEach(function (ip) {
    //     if (req.connection.remoteAddress === ip && isIP == false) {
    //         isIP = true;
    //         callback();
    //         return;
    //     }
    // });
    // if (!isIP) {
    //     res.send({ code: '-1', msg: "you can't access" });
    // }
}

function CheckErrorStatus(req, res, UserInfo, callback) {
    if (UserInfo.lock_status === "N") {
        if (UserInfo.Error >= 3) {
            var deadline = new Date(UserInfo.LockTime);
            if (Date.now() > deadline) {
                callback();
            } else {
                res.send({ code: '-1', msg: "Account is Locking about 5 mins" });
            }
        }
        else
        { callback(); }
    } else {
        res.send({ code: '-1', msg: "Account is Locking" });
    }
}

router.post('/PasswordUpdate', function (req, res) {
    var now = new Date();
    now.setMinutes(now.getMinutes() + 129600);
    var ohash = crypto.createHash('sha512');
    var opass = ohash.update(req.body.OldPassword + salt).digest('hex');
    var nhash = crypto.createHash('sha512');
    var npass = nhash.update(req.body.Password + salt).digest('hex');

    common.BackendConnection(res, function (err, connection) {
        connection.query("SELECT * FROM backend.Account where account=?", [req.cookies.Account], function (error, dbresults, fields) {
            connection.release();
            var account = dbresults[0].account;
            var autho = dbresults[0].autho;
            if (dbresults[0].password == opass) {
                common.BackendConnection(res, function (err, connection) {
                    connection.query("update backend.Account SET password=?,PasswordModifyTime=? where account=?;", [npass, now, req.cookies.Account], function (error, dbresults, fields) {
                        connection.release();
                        req.session['account'] = account;
                        req.session['autho'] = autho;
                        res.send({ code: '0', html: 'Notification' });
                        res.end();
                    });
                });
            } else {
                res.send({ code: '-1', msg: "舊密碼錯誤" });
            }
        });
    });
});
module.exports = router;