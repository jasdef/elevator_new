var express = require('express');
var path = require("path");
var router = express.Router();
var request = require('request');
var async = require("async");

router.get('/MemberSearchForm', function (req, res) {
    common.log(req.session['account'], 'call MemberSearchForm');
    common.CreateHtml("MemberSearchForm", req, res);
});

router.get('/MemberEditForm', function (req, res) {
    common.log(req.session['account'], 'call MemberEditForm');
    common.CreateHtml("MemberEditForm", req, res);
});

router.get('/MemberChargeForm', function (req, res) {
    common.log(req.session['account'], 'call MemberChargeForm');
    common.CreateHtml("MemberChargeForm", req, res);
});

ClearSingleToken = function (MemberId, callback){
    common.ConnectGameMongo(function (pool) {
        var dbo = pool.db("JCGGame");
        dbo.collection("memberTokenStorage").remove({"_id" : MemberId}, function(err, numberRemoved) {
            if (err) {
                common.log("system", err);
            } else {
                common.log("system", numberRemoved + " Token(s) removed");
            }
            callback(numberRemoved, err);
        });
    }); 
}

router.post('/MemberSearch', function (req, res) {
    common.CreateHtml("MemberSearch", req, res, function (err) {
        common.JCGConnection_ReadOnly(res, function (err, connection) {
            var countSelect = 'SELECT COUNT(`MemberId`) AS count FROM backendMemberInfo WHERE 1';
            var dataSelect = 'SELECT MemberId, NickName, Email, Account, CellPhoneNum, Name, Nation, Address, CreateTime, NormalLoginAuth, MemberVIP, MemberLevel, ActiveValue, TransactionAuth, BindCellPhoneAuth, ForgetPasswordAuth, MemberBalance, LastLogInTime FROM backendMemberInfo WHERE 1';
            var whereSQL = '';

            var searchData = JSON.parse(req.body.search);
            var searchArray = [];
            var searchColumn = { 
                MemberId: { col: 'MemberId', ope: MemberId2Equ(searchData.MemberId) }, // column operator
                MemberNickName: { col: 'NickName', ope: 'like' },
                MemberEmail: { col: 'Email', ope: 'like' },
                MemberAccount: { col: 'Account', ope: 'like' },
                MemberPhone: { col: 'CellPhoneNum', ope: 'like' },
                MemberName: { col: 'Name', ope: 'like' },
                MemberNation: { col: 'Nation', ope: 'like' },
                MemberAddress: { col: 'Address', ope: 'like'},
                MemberCreateTimeStart: { col: 'CreateTime', ope: '>=' },
                MemberCreateTimeEnd: { col: 'CreateTime', ope: '<=' },
                MemberStatus: { col: 'NormalLoginAuth', ope: '=' },
                MemberVIPLV: { col: 'MemberVIP', ope: '=' },
                MemberActiveD: { col: 'ActiveValue', ope: '>=' },
                MemberActiveT: { col: 'ActiveValue', ope: '<=' },
                MemberLV: { col: 'MemberLevel', ope: EquValue(searchData.MemberLV_filter) },
            };

            Object.keys(searchData).forEach(function(value, index) {
                if(searchColumn[value] != null){
                    whereSQL += ' AND ' + searchColumn[value].col + ' ' + searchColumn[value].ope + ' ? ';
                    searchArray.push(searchColumn[value].ope == 'like' ? '%' + searchData[value] + '%' : searchData[value])
                }
            });

            var countSQL = connection.format(countSelect + whereSQL + ';', searchArray);

            // ORDER
            var orderColumn = connection.escapeId(req.body["columns[" + req.body['order[0][column]'] + "][data]"]);
            var orderSQL = ' ORDER BY ' + orderColumn + ' ' + (req.body["order[0][dir]"] == "asc" ? "ASC" : "DESC");
            // LIMIT
            var limitSQL = ' LIMIT ' + connection.escape(Number(req.body.start)) + ', ' + connection.escape(Number(req.body.length));
            // GET DATA
            var dataSQL = connection.format(dataSelect + whereSQL + orderSQL + limitSQL + ';', searchArray);

            var sql = countSQL + dataSQL;
            common.log(req.session['account'], sql);

            var query = connection.query(sql, function (err, result, fields) {
                if (err) {
                    common.log(req.session['account'], err);
                    res.send({ error: err });
                } else {
                    var totallength = result[0][0].count;
                    res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: result[1] });
                }
                connection.release();
                res.end();
            });
        });
    });
});

router.post('/MemberView', function (req, res) {
    common.CreateHtml("MemberEdit", req, res, function (err) {
        common.JCGConnection_ReadOnly(res, function (err, connection) {
            var sql = 
            `   
                SELECT 
                    a.MemberId as MemberId,
                    c.Account as Account,
                    a.NickName as NickName,
                    a.Name as Name,
                    a.Email as Email,
                    a.IdNumber as IdNumber,
                    a.Birth as Birth,
                    a.PhoneNumber as PhoneNumber,
                    e.CellPhoneNum as CellPhoneNum,
                    a.ActiveValue as ActiveValue,
                    b.MemberBalance as MemberBalance,
                    f.NormalLoginAuth as NormalLoginAuth,
                    a.CreateTime as CreateTime,
                    g.MemberLoginTime as LastLoginTime,
                    h.MemberLoginDeviceInfo as FirstDeviceInfo,
                    g.MemberLoginDeviceInfo as LastDeviceInfo
                FROM Member as a
                JOIN MemberStatus as b
                ON a.MemberId = b.MemberId
                LEFT JOIN AccountData as c
                ON a.MemberId = c.MemberId
                LEFT JOIN MemberStatusCellPhoneNumber as d
                ON a.MemberId = d.MemberId
                LEFT JOIN CellPhoneNumber as e
                ON d.CellPhoneNumberId = e.Id
                LEFT JOIN MemberAuthority as f
                ON a.MemberId = f.MemberId
                LEFT JOIN (SELECT * FROM MemberLoginHistory WHERE Id IN(SELECT MAX(Id) FROM MemberLoginHistory WHERE MemberId = ?)) as g
                ON a.MemberId = g.MemberId
                LEFT JOIN (SELECT * FROM MemberLoginHistory WHERE Id IN(SELECT MIN(Id) FROM MemberLoginHistory WHERE MemberId = ?)) as h
                ON a.MemberId = h.MemberId
                WHERE a.MemberId = ?
            `;
            sql = connection.format(sql, [req.body.MemberId, req.body.MemberId, req.body.MemberId]);
            connection.query(sql, function (err, dbresults, fields) {
                connection.release();
                if (err) {
                    common.log(req.session['account'], err);
                    res.send({ code: "-1", msg: "資料庫連線異常" });
                } else {
                    res.send({ code: "0", msg: dbresults });
                }
                res.end();
            });
        });
    });
});
router.post('/MemberEdit', function (req, res) {
    common.CreateHtml("MemberEdit", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var updateColumn = {
                NickName: 'NickName',
                MemberName: 'Name',
                MemberEmail: 'Email',
                MemberActive: 'ActiveValue'
            };
            var updateArr = {};
            Object.keys(req.body).forEach(function (value, index) {
                if (updateColumn[value] !== undefined) {
                    var updateStr = req.body[value].replace(/\s+/g, "");
                    if (updateStr.length > 0) {
                        var key = updateColumn[value];
                        updateArr[key] = updateStr;
                    }
                }
            });

            var sql = connection.format('UPDATE `Member` SET ? WHERE MemberId = ?', [updateArr, req.body.MemberId]);
            connection.query(sql, function (err, dbresults, fields) {
                connection.release();
                if (err) {
                    common.log(req.session['account'], err);
                    res.send({ code: "-1", msg: `修改失敗${err.errno === 1062 ? '，暱稱重複':''}`});
                } else {
                    res.send({ code: "0", msg: "修改成功" });
                }
                res.end();
            });
        });
    });
});

router.post('/NickNameChecker', function (req, res) {
    common.CreateHtml("MemberEdit", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var sql = connection.format("SELECT COUNT(`Id`) as 'count' FROM `Member` WHERE `NickName` = ?", [req.body.nickName]);
            connection.query(sql, function (err, results, fields) {
                connection.release();
                if (err) {
                    common.log(req.session['account'], err);
                    res.send({ code: "-1", msg: `資料庫連線異常`, });
                } else {
                    if (results[0].count > 0) {
                        res.send({ code: '-1', msg: "已經有此遊戲暱稱，無法設定" });
                    } else {
                        res.send({ code: '1', msg: "沒有重複遊戲暱稱，可以設定" });
                    }
                }
                res.end();
            });
        });
    });
});


router.post('/MemberUnlockChangePasswordVerifyCodeRequest', function (req, res) {
    common.CreateHtml("MemberEdit", req, res, function (err) {
        getForgetPwdVerifyStatusByMemberId(res, req.body.MemberId, function (result) {
            common.SCGConnection(res, function (err, connection) {
                if (err) throw err;
                if (result && result.length > 0) {
                    var sql = "UPDATE JCGGame.MemberAuthority SET ForgetPasswordAuth = ? WHERE MemberId = ?;" +
                        "UPDATE JCGGame.Verification SET VerifyCount = ?, SendCount = ? WHERE VerificationId = ?;";
                    var updateData = [1, result[0].MemberId, 0, 0, result[0].VerificationId];
                    var query = connection.query(sql, updateData, function (err, result) {
                        if (err) {
                            res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
                        } else {
                            res.send({ code: "0", msg: "修改成功", result: result });
                        }
                        connection.release();
                        res.end();
                    });
                    common.log(req.session['account'], query.sql);
                } else {
                    res.send({ code: "-1", msg: "修改失敗", result: err });
                    connection.release();
                    res.end();
                }
            });
        });
    });
});

router.post('/MemberUnlockBindPhoneVerifyCodeRequest', function (req, res) {
    common.CreateHtml("MemberEdit", req, res, function (err) {
        getBindPhoneVerifyStatusByMemberId(res, req.body.MemberId, function (result) {
            common.SCGConnection(res, function (err, connection) {
                if (err) throw err;
                if (result && result.length > 0) {
                    var sql = "UPDATE JCGGame.MemberAuthority SET BindCellPhoneAuth = ? WHERE MemberId = ?;";
                    var updateData = [1, result[0].MemberId];
                    for (var i = 0; i < result.length; i++) {
                        sql += "UPDATE JCGGame.Verification SET VerifyCount = ?, SendCount = ? WHERE VerificationId = ?;";
                        updateData.push(0);
                        updateData.push(0);
                        updateData.push(result[i].VerificationId);
                    }

                    var query = connection.query(sql, updateData, function (err, result) {
                        if (err) {
                            res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
                        } else {
                            res.send({ code: "0", msg: "修改成功", result: result });
                        }
                        connection.release();
                        res.end();
                    });
                    common.log(req.session['account'], query.sql);
                } else {
                    res.send({ code: "-1", msg: "修改失敗", result: err });
                    connection.release();
                    res.end();
                }
            });
        });
    });
});

router.post('/MemberUnlockTransactionVerifyCodeRequest', function (req, res) {
    common.CreateHtml("MemberEdit", req, res, function (err) {
        getTransactionStatusBySN(res, req.body.MemberId, function (result) {
            common.SCGConnection(res, function (err, connection) {
                if (err) throw err;
                if (result && result.length > 0) {
                    var sql = "UPDATE JCGGame.MemberAuthority SET TransactionAuth = ? WHERE MemberId = ?;";
                    var updateData = [1, result[0].Sender];
                    for (var i = 0; i < result.length; i++) {
                        sql += "UPDATE JCGGame.Verification SET VerifyCount = ?, SendCount = ? WHERE VerificationId = ?;";
                        updateData.push(0);
                        updateData.push(0);
                        updateData.push(result[i].VerificationId);
                    }

                    var query = connection.query(sql, updateData, function (err, result) {
                        if (err) {
                            res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
                        } else {
                            res.send({ code: "0", msg: "修改成功", result: result });
                        }
                        connection.release();
                        res.end();
                    });
                    common.log(req.session['account'], query.sql);
                } else {
                    res.send({ code: "-1", msg: "修改失敗", result: err });
                    connection.release();
                    res.end();
                }
            });
        });
    });
});

router.post('/MemberCostBalance', function (req, res) {
    common.CreateHtml("MemberEdit", req, res, function (err) {
        if (req.body.CostBalance > 0) {
            res.send({ code: "-1", msg: "修改失敗" });
            res.end();
            return;
        }
        getMemberBalance(res, req.body.MemberId, function (result) {
            if (result && result.length > 0) {
                common.SCGConnection(res, function (err, connection) {
                    if (err) throw err;
                    var balance = result[0].MemberBalance + parseInt(req.body.CostBalance);
                    if (balance < 0) {
                        res.send({ code: "-1", msg: "修改失敗, 操作後餘額小於 0!" });
                        connection.release();
                        res.end();
                        return;
                    }

                    var sql = "UPDATE JCGGame.MemberStatus SET MemberBalance = ? WHERE MemberId = ?;" +
                        "INSERT INTO backend.MemberBalanceHistory (MemberId, BalanceBefore, BalanceAfter, CostBalance) VALUES (?, ?, ?, ?);"
                    var updateData = [balance, req.body.MemberId, req.body.MemberId, result[0].MemberBalance, balance, req.body.CostBalance * -1];
                    var query = connection.query(sql, updateData, function (err, result) {
                        if (err) {
                            res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
                        } else {
                            res.send({ code: "0", msg: "修改成功", result: result });
                        }
                        connection.release();
                        res.end();
                    });
                    common.log(req.session['account'], query.sql);
                });
            } else {
                res.send({ code: "-1", msg: "修改失敗", result: err });
                connection.release();
                res.end();
            }
        });
    });
});

var autoSetSuspension = setInterval(function(){
    var memList = [];
    var needChange = false;
    var AsyncList = [
        // 找出停權過期帳號
        function(callback) {
            common.BackendConnection_ReadOnly(function (err, connection) {
                var sql = "SELECT `MemberId` FROM `SuspensionList` WHERE `endTime` <= now() AND `Type` = 'S' AND `Del` = 'N'";
                common.log("system", sql);
                connection.query(sql, function (err, dbresults, fields) {
                    needChange = dbresults.length > 0;
                    dbresults.forEach(function(value, key) {
                        memList.push(value.MemberId);
                    });
                    connection.release();
                    callback(err);
                });
            });
        },
        // 更新停權列表
        function(callback) {
            if (needChange) {
                common.BackendConnection(function (err, connection) {
                    var sql = connection.format("UPDATE `SuspensionList` SET `Del` = 'A' WHERE `MemberId` IN(?)", [memList]);
                    common.log("system", sql);
                    connection.query(sql, function (err, dbresults, fields) {
                        connection.release();
                        callback(err);
                    });
                });
            } else {
                callback();
            }
        },
        // 更新帳號狀態
        function(callback) {
            if (needChange) {
                common.SCGConnection(function (err, connection) {
                    var sql = connection.format("UPDATE `MemberAuthority` SET `NormalLoginAuth` = '1' WHERE `MemberId` IN(?)", [memList]);
                    common.log("system", sql);
                    connection.query(sql, function (err, dbresults, fields) {
                        callback(err);
                        connection.release();
                    });
                });
            } else {
                callback();
            }
        },
        // 更新CDN資料
        function(callback) {
            common.BackendConnection_ReadOnly(function (err, connection) {
                var sql = "SELECT `nickName`, DATE_FORMAT(`startTime`, '%Y-%m-%d %H:%i:%s') as startTime, DATE_FORMAT(`endTime`, '%Y-%m-%d %H:%i:%s') as endTime, `setNote` as Note FROM `SuspensionList` WHERE `Type` = 'S' AND `Del` = 'N' ORDER BY `Id` DESC";
                common.log("system", sql);
                connection.query(sql, function (err, result, fields) {
                    callback(err);
                    var uploadArr = {
                        "updateTime": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                        "memberList": result
                    };
                    cdnUpload(uploadArr, 'SuspensionList', 'SuspensionList.json', function (httpStatus, res) {
                    });
                    connection.release();
                });
            });
        }
    ];
    async.series(AsyncList, function(err, result) {
        common.log("system", "autoSetSuspension - " + JSON.stringify(err));
    });
}, common.delayTimeSetting() * 60 * 1000);

router.post('/MemberSuspension', function (req, res) {
    common.CreateHtml("MemberSuspension", req, res, function (err) {
        var valueData = {
            Type: 'S',
            MemberId: req.body.MemberId,
            nickName: req.body.nickName,
            account: req.session['account']
        }
        var isSuspension = true;

        var AsyncList = [
            // 確認會員是否重複設定
            function(callback) {
                common.JCGConnection_ReadOnly(function (err, connection) {
                    var sql = connection.format("SELECT `Id` FROM `MemberAuthority` WHERE `MemberId` = ? AND `NormalLoginAuth` = ?", [req.body.MemberId, req.body.LoginAuth]);
                    common.log(req.session['account'], sql);
                    connection.query(sql, function (err, dbresults, fields) {
                        connection.release();
                        isSuspension = dbresults.length > 0;
                        callback( isSuspension ? `SuspensionMem : ${req.body.MemberId}` : null );
                    });
                });
            },
            // 新增停權會員到官網表
            function(callback) {
                common.BackendConnection(function (err, connection) {
                    var sql;
                    if(req.body.LoginAuth == '0'){
                        valueData.setNote = req.body.Note;
                        valueData.ViolationType = req.body.ViolationType;
                        if( req.body.duration == 0 ){
                            sql = connection.format("INSERT INTO `SuspensionList` SET ?", valueData);
                        } else {
                            sql = connection.format("INSERT INTO `SuspensionList` SET ?, `endTime` = now() + INTERVAL ? MINUTE", [valueData, req.body.duration]);
                        }
                    } else {
                        sql = connection.format("UPDATE `SuspensionList` SET `unsetNote` = ?, `Del` = 'Y' WHERE `MemberId` = ? AND `Del` = 'N'", [req.body.Note, req.body.MemberId]);
                    }
                    
                    common.log(req.session['account'], sql);
                    connection.query(sql, function (err, dbresults, fields) {
                        connection.release();
                        callback(err);
                    });
                });
            },
            // 停權+解除停權會員
            function(callback) {
                common.SCGConnection(function (err, connection) {
                    var sql = connection.format("UPDATE `MemberAuthority` SET `NormalLoginAuth` = ? WHERE `MemberId` = ?", [req.body.LoginAuth == '0' ? '0' : '1', req.body.MemberId]);
                    common.log(req.session['account'], sql);
                    connection.query(sql, function (err, dbresults, fields) {
                        connection.release();
                        callback(err);
                    });
                });
            },
            // 強制剔除會員
            function(callback) {
                if(req.body.LoginAuth == '0'){
                    ClearSingleToken(req.body.MemberId, function(numberRemoved, err){
                        console.log(numberRemoved, err);
                        callback(err);
                    });
                } else {
                    callback();
                }
            }
            // SFS 剔除會員
        ];
        async.series(AsyncList, function(err, result) {
            if (err) {
                common.log(req.session['account'], err);
                res.send({ code: "-1", error: err }).end();
            } else {
                res.send({ code: "0" }).end();
            }
        });
    });
});

function EquValue(data) {
    var str = "";
    switch (data) {
        case "0":
            str = "=";
            break;
        case "1":
            str = ">";
            break;
        case "2":
            str = "<";
            break;
        default:
            str = "=";
            break;
    }
    return str;
}

function MemberId2Equ(MemberId){
    if(MemberId != null){
        return MemberId.length == 13 ? '=' : 'like';
    } else {
        return 'like';
    }
}

router.post('/MemberChargeHistory', function (req, res) {
    common.CreateHtml("MemberChargeHistory", req, res, function (err) {
        var Page = (req.body.start / req.body.length) + 1;
        var Limit = req.body.length;
        var data = {
            MemberID: req.body.MemberID,
            Type: parseInt(req.body.Type),
            Page: parseInt(Page),
            Limit: parseInt(Limit)
        };
        console.log(data);
        common.ChargeURL(function (url) {
            url = url + "/FindHistory";
            request.post({ url, form: JSON.stringify(data) }, function (err, httpResponse, body) {
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
});

function getForgetPwdVerifyStatusByMemberId(res, MemberId, callback) {
    common.SCGConnection(res, function(err, connection) {
        if (err) throw err;
        console.log("MemberId : " + MemberId);

        var sql =   "SELECT " + 
                        "`b`.`Id` AS `Id`, " +
                        "`b`.`MemberId` AS `MemberId`, " +
                        "`a`.`VerificationId` AS `VerificationId`, " +
                        "`c`.`VerifyCount` AS `VerifyCount`, " +
                        "`c`.`SendCount` AS `SendCount`, " +
                        "`d`.`ForgetPasswordAuth` AS `ForgetPasswordAuth` " +
                    "FROM " +
                        "(((`ChangePasswordRequest` `a` " +
                        "LEFT JOIN `AccountData` `b` ON ((`a`.`AccountId` = `b`.`Id`))) " +
                        "LEFT JOIN `Verification` `c` ON ((`a`.`VerificationId` = `c`.`VerificationId`))) " +
                        "LEFT JOIN `MemberAuthority` `d` ON ((`b`.`MemberId` = `d`.`MemberId`))) " +
                    "WHERE " +
                        "(`b`.`MemberId` = ?)";

        var updateData = [MemberId];
        var query = connection.query(sql, updateData, function(err, result) {
            console.log("err : " + err);
            console.log("result : " + result);
            connection.release();
            callback(result);
        });
    });
}

function getMemberBalance(res, MemberId, callback) {
    common.SCGConnection(res, function(err, connection) {
        if (err) throw err;
        
        var sql =   "SELECT MemberBalance FROM MemberStatus WHERE MemberId = ?";
        var updateData = [MemberId];
        var query = connection.query(sql, updateData, function(err, result) {
            console.log("err : " + err);
            console.log("result : " + result);
            connection.release();
            callback(result);
        });
    });
}

function getBindPhoneVerifyStatusByMemberId(res, MemberId, callback) {
    common.SCGConnection(res, function(err, connection) {
        if (err) throw err;
        console.log("MemberId : " + MemberId);

        var sql =   "SELECT " + 
                        "`a`.`MemberId` AS `MemberId`, " +
                        "`b`.`VerificationId` AS `VerificationId`, " +
                        "`b`.`VerifyCount` AS `VerifyCount`, " +
                        "`b`.`SendCount` AS `SendCount`, " +
                        "`c`.`BindCellPhoneAuth` AS `BindCellPhoneAuth` " +
                    "FROM " +
                        "((`CellPhoneNumberBindRequest` `a` " +
                        "LEFT JOIN `Verification` `b` ON ((`a`.`VerificationId` = `b`.`VerificationId`))) " +
                        "LEFT JOIN `MemberAuthority` `c` ON ((`a`.`MemberId` = `c`.`MemberId`))) " +
                    "WHERE " +
                        "(`a`.`MemberId` = ?) ";

        var updateData = [MemberId];
        var query = connection.query(sql, updateData, function(err, result) {
            console.log("err : " + err);
            console.log("result : " + result);
            connection.release();
            callback(result);
        });
    });
}

function getTransactionStatusBySN(res, MemberId, callback) {
    common.SCGConnection(res, function(err, connection) {
        if (err) throw err;
        
        var sql =   "SELECT * FROM TransactionRequest WHERE Sender = ?";
        var updateData = [MemberId];
        var query = connection.query(sql, updateData, function(err, result) {
            console.log("err : " + err);
            console.log("result : " + result);
            connection.release();
            callback(result);
        });
    });
}

module.exports = router;