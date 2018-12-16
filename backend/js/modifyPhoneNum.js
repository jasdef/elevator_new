var express = require('express');
var router = express.Router();

router.get('/ModifyPhoneNum', function(req, res){
    common.log(req.session['account'], 'call ModifyPhoneNum');
    common.CreateHtml("ModifyPhoneNum", req, res);
});

router.post('/UpdatePhoneNum', function (req, res) {//3
    common.CreateHtml("ModifyPhoneNum_Transfer", req, res, function (err) {
        common.SCGConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            var updateSQL = "update MemberStatusCellPhoneNumber set `CellPhoneNumberId`=? where MemberId=?;";
            var historySQL = "insert into ModifyPhoneNumHistory (`MemberId`, `NumBefore`, `NumAfter`, `Author`, `Note`) VALUES(?,?,?,?,?);";
            var updateData = [requestData.PhoneId, requestData.MemberId];
            var historyData = [requestData.MemberId, requestData.OldPhoneNum, requestData.NewPhoneNum, req.session['account'], requestData.Note];
            updateSQL = connection.format(updateSQL, updateData);
            historySQL = connection.format(historySQL, historyData);
            var sql = updateSQL+historySQL;
            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "更新門號失敗!!", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "更新門號成功!" }).end();
                }
            });
        });    
    });
});

router.post('/AddPhoneNum', function(req, res) {//4
    common.CreateHtml("ModifyPhoneNum_Transfer", req, res, function (err) {
    common.SCGConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var cellPhoneSQL = "insert into CellPhoneNumber (`CellPhoneNum`, `CountryCode`) VALUES (?,?);";
            var bindPhoneSQL = "insert into MemberStatusCellPhoneNumber (`CellPhoneNumberId`,`MemberId`) VALUES (LAST_INSERT_ID(),?);";
            var historySQL = "insert into ModifyPhoneNumHistory (`MemberId`, `NumBefore`, `NumAfter`, `Author`, `Note`) VALUES(?,?,?,?,?);";
            var historyData = [requestData.MemberId, requestData.OldPhoneNum, requestData.NewPhoneNum, req.session['account'], requestData.Note];
            var cellPhoneData = [requestData.NewPhoneNum, "TW"];
            var bindPhoneData = [requestData.MemberId];
            cellPhoneSQL = connection.format(cellPhoneSQL, cellPhoneData);
            bindPhoneSQL = connection.format(bindPhoneSQL, bindPhoneData);
            historySQL = connection.format(historySQL, historyData);

            var sql = cellPhoneSQL+bindPhoneSQL+historySQL;

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "更新門號失敗!!", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "更新門號成功!" }).end();
                }
            });

    });
    });
});

router.post('/AddCellPhoneNumber', function(req, res) {//2
    common.CreateHtml("ModifyPhoneNum_Transfer", req, res, function (err) {
    common.SCGConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var cellPhoneSQL = "insert into CellPhoneNumber (`CellPhoneNum`, `CountryCode`) VALUES (?,?);";
            var updateSQL = "update MemberStatusCellPhoneNumber set `CellPhoneNumberId`=LAST_INSERT_ID() where MemberId=?;";
            var historySQL = "insert into ModifyPhoneNumHistory (`MemberId`, `NumBefore`, `NumAfter`, `Author`, `Note`) VALUES(?,?,?,?,?);";
            var historyData = [requestData.MemberId, requestData.OldPhoneNum, requestData.NewPhoneNum, req.session['account'], requestData.Note];
            var cellPhoneData = [requestData.NewPhoneNum, "TW"];
            var updatePhoneData = [requestData.MemberId];
            cellPhoneSQL = connection.format(cellPhoneSQL, cellPhoneData);
            updateSQL = connection.format(updateSQL, updatePhoneData);
            historySQL = connection.format(historySQL, historyData);

            var sql = cellPhoneSQL+updateSQL+historySQL;

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "更新門號失敗!!", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "更新門號成功!" }).end();
                }
            });
        });
    });
});

router.post('/AddMemberStatusCellPhoneNumber', function(req, res) {//1
    common.CreateHtml("ModifyPhoneNum_Transfer", req, res, function (err) {
    common.SCGConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var bindPhoneSQL = "insert into MemberStatusCellPhoneNumber (`CellPhoneNumberId`,`MemberId`) VALUES (?,?);";
            var historySQL = "insert into ModifyPhoneNumHistory (`MemberId`, `NumBefore`, `NumAfter`, `Author`, `Note`) VALUES(?,?,?,?,?);";
            var historyData = [requestData.MemberId, requestData.OldPhoneNum, requestData.NewPhoneNum, req.session['account'], requestData.Note];

            var bindPhoneData = [requestData.PhoneId, requestData.MemberId];
 
            bindPhoneSQL = connection.format(bindPhoneSQL, bindPhoneData);
            historySQL = connection.format(historySQL, historyData);

            var sql = bindPhoneSQL+historySQL;

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "更新門號失敗!!", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "更新門號成功!" }).end();
                }
            });

        });
    });
});



router.post('/CheckPhoneNum', function (req, res) {
    common.CreateHtml("ModifyPhoneNum_Transfer", req, res, function (err) {
        common.BackendConnection(res, function(err, connection) {
            var sql = "select count(`Number`) as count from BlockadePhone where Number = ?";
            var NewPhoneNum = req.body.NewPhoneNum;
            var MemberId = req.body.MemberId;
            var action;//1新增門號 2修改門號
            sql = connection.format(sql, NewPhoneNum);
            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "檢查是否有在封鎖名單內失敗", err: error }).end();
                }
                else {
                    if (result[0].count == 0) {
                        connection.release();                    
                        common.SCGConnection(res, function(err, connection){
                            sql = "select Id, count(`CellPhoneNum`) as count from CellPhoneNumber where CellPhoneNum= ?";
                            sql = connection.format(sql, NewPhoneNum);
                            common.log(req.session['account'], sql);
                            connection.query(sql, function (error, result, fields) {
                                if (error) {
                                    common.log(req.session['account'], error);
                                    connection.release();                    
                                    res.send({ code: -1, msg: "檢查是否有曾註冊此門號失敗", err: error }).end();
                                }
                                else {
                                    if (result[0].count == 0) {//沒有存在
                                        sql = "select count(`CellPhoneNumberId`) as count from MemberStatusCellPhoneNumber where MemberId=?"
                                        sql = connection.format(sql, MemberId);
                                        common.log(req.session['account'], sql);
                                        connection.query(sql, function (error, result, fields) {
                                            if (error) {
                                                common.log(req.session['account'], error);
                                                connection.release();                    
                                                res.send({ code: -1, msg: "檢查該玩家是否有綁定 失敗!", err: error }).end();
                                            }
                                            else {
                                                if (result[0].count == 0) {//沒有綁定資料
                                                    connection.release();       
                                                    action = 4;             
                                                    res.send({ code: 0, msg: "此門號可以綁定", action: action}).end();
                                                }
                                                else {//有綁定資料
                                                    connection.release();     
                                                    action = 2;               
                                                    res.send({ code: 0, msg: "此門號可以綁定", action: action}).end();             
                                                }
                                            }
                                        });
                                    }
                                    else {//存在
                                        sql = "select count(`CellPhoneNumberId`) as count from MemberStatusCellPhoneNumber where CellPhoneNumberId=?";
                                        sql = connection.format(sql, result[0].Id);
                                        var CellPhoneNumberId = result[0].Id;
                                        common.log(req.session['account'], sql);
                                        connection.query(sql, function (error, result, fields) {
                                            if (error) {
                                                common.log(req.session['account'], error);
                                                connection.release();                    
                                                res.send({ code: -1, msg: "檢查綁定數量失敗", err: error }).end();
                                            }
                                            else {
                                                if (result[0].count < 5) {
                                                    sql = "select count(`CellPhoneNumberId`) as count from MemberStatusCellPhoneNumber where MemberId=?"
                                                    sql = connection.format(sql, MemberId);
                                                    common.log(req.session['account'], sql);
                                                    connection.query(sql, function (error, result, fields) {
                                                        if (error) {
                                                            common.log(req.session['account'], error);
                                                            connection.release();                    
                                                            res.send({ code: -1, msg: "檢查該玩家是否有綁定 失敗!", err: error }).end();
                                                        }
                                                        else {
                                                            if (result[0].count == 0) {//沒有綁定資料
                                                                connection.release();       
                                                                action = 1;             
                                                                res.send({ code: 0, msg: "此門號可以綁定", action: action, phoneId: CellPhoneNumberId}).end();
                                                            }
                                                            else {//有綁定資料
                                                                connection.release();     
                                                                action = 3;               
                                                                res.send({ code: 0, msg: "此門號可以綁定", action: action, phoneId: CellPhoneNumberId}).end();             
                                                            }
                                                        }
                                                    });
                                                }
                                                else {
                                                    connection.release();                    
                                                    res.send({ code: -1, msg: "此門號已超過5個帳號的綁定上限", err: error }).end();
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                    else {
                        connection.release();                    
                        res.send({ code: -1, msg: "此門號已被封鎖", err: error }).end();
                    }
                } 
            });
        }); 
    });
});


module.exports = router;