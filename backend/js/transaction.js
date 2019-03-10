var express = require('express');
var path = require("path");
var router = express.Router();
var fileUpload = require('express-fileupload');
var async = require('async');
var request = require('request');

router.get('/Transaction', function(req, res) {
    common.log(req.session['account'], 'call Transaction');
    common.CreateHtml("Transaction", req, res);
});

router.get('/TransactionAdd', function(req, res) {
    common.log(req.session['account'], 'call Transaction add');
    common.CreateHtml("TransactionAdd", req, res);

});

router.get('/TransactionEdit', function(req, res) {
    common.log(req.session['account'], 'call Transaction edit');
    common.CreateHtml("TransactionEdit", req, res);

});

router.post('/GetTransactionList', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from transaction_form;";
            var countSelect = "select COUNT(*) as count from transaction_form;";

   
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

router.post('/GetTransactionData', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var transactionID = req.body.Id;
            
            var dataSelect = "select * from transaction_form where id="+transactionID+";";
   
            var sql = dataSelect;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], err);
                    res.send({error : err});
                }
                else {
            
                    res.send({ data: result[0] });
                }
                connection.release();
                res.end();
            });

        });        
    });

});

router.post('/EditTransaction', function(req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addTransactionSQL = "update transaction_form set `title`=?, `left_price`=?, `total_price`=?, `start_date`=?, `is_return`=?, `is_duty`=?, `is_receipt`=?, `elevator_num`=?, `note`=?, `customer_id`=?, `items`=? where `id`=?;";

            var historyData = [requestData.MemberId, requestData.OldPhoneNum, requestData.NewPhoneNum, req.session['account'], requestData.Note];
            var itemsJson = JSON.stringify(requestData.items);
            var transactionData = 
            [
                requestData.title, 
                requestData.leftPrice,
                requestData.totalPrice,
                requestData.startDate,
                requestData.isReturn,
                requestData.isDuty,
                requestData.isReceipt,
                requestData.elevatorNum,
                requestData.note,
                requestData.customerId,
                itemsJson,
                requestData.id
            ];
  
            addTransactionSQL = connection.format(addTransactionSQL, transactionData);

            var sql = addTransactionSQL;

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

router.post('/AddTransaction', function(req, res) {//4
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addTransactionSQL = "insert into transaction_form (`title`, `left_price`, `total_price`, `start_date`, `is_return`, `is_duty`, `is_receipt`, `elevator_num`, `note`, `customer_id`, `items`) VALUES (?,?,?,?,?,?,?,?,?,?,?);";

            var historyData = [requestData.MemberId, requestData.OldPhoneNum, requestData.NewPhoneNum, req.session['account'], requestData.Note];
            var itemsJson = JSON.stringify(requestData.items);
            var transactionData = 
            [
                requestData.title, 
                requestData.leftPrice,
                requestData.totalPrice,
                requestData.startDate,
                requestData.isReturn,
                requestData.isDuty,
                requestData.isReceipt,
                requestData.elevatorNum,
                requestData.note,
                requestData.customerId,
                itemsJson
            ];
  
            addTransactionSQL = connection.format(addTransactionSQL, transactionData);

            var sql = addTransactionSQL;

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "新增失敗", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "新增成功!" }).end();
                }
            });

    });
    });
});


router.post('/DeleteTransaction', function (req, res){
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteTransaction");

        common.BackendConnection(res, function (err, connection) {
            var transactionID = req.body.Id;
            var deleteTransaction = "delete from `transaction_form` where `id` = "+transactionID+";";
        
            var sql = deleteTransaction;

            var query = connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({ code: error, msg: "刪除失敗", err: error });
                } else {
                                       
                    res.send({ code: 0, msg: "刪除成功" });
                }
                connection.release();
                res.end();
            });

        });
    });
});


router.post('/CheckMemberId', function(req, res) {
    common.CreateHtml("SimpleDeposit_Transfer", req, res, function () {
        common.log(req.session['account'], "Call CheckMember");
        var memberId = req.body.memberId;
        common.JCGConnection_ReadOnly(res, function (err, connection) {
            var sql = connection.format("SELECT count(`MemberId`) as count FROM Member where `MemberId` = ?",[memberId]);

            common.log(req.session['account'], sql);

            connection.query(sql, function (err, result, fields) {
                if (err) {
                    common.log(req.session['account'], err);
                    res.send({ error: err });
                } 
                else {
                    var count = result[0].count;
                    if (count == 1) {
                        res.send({ code: 0, msg: "此帳號合法!!" });
                    }
                    else if (count > 1) {
                        res.send({ code: -1, msg: "查到該帳號有重複 請聯絡RD!!" });
                        common.log(req.session['account'], "the same MemeberId count = "+count+" MemberId :"+memberId);
                    }
                    else {
                        res.send({ code: -1, msg: "查無此帳號" });
                    }
                }
                connection.release();
                res.end();
            });
        });
    });
});


router.post('/DepositMoney', function (req, res){
    common.CreateHtml("SimpleDeposit_Transfer", req, res, function (err) {
        var requestData = JSON.parse(req.body.requestData);
       
        common.log(req.session['account'], "Call DepositMoney");
        common.log(req.session['account'], requestData);

        var data = {
            MemberID: requestData.Account,
            NT : requestData.NT,
            Coin : parseInt(requestData.Coin),
            CreateTime : requestData.CreateTime,
            Source : requestData.DepositType,
            Description : "jumbo to do",
            Type : parseInt(requestData.DepositSource),
            TradeNum : "",
        };
    
        var data2 = {
            memberId : requestData.Account,
            vipPoint : requestData.VIPPoint,
            rechargeValue : requestData.Coin,
            source : requestData.DepositType,
            description : "jumbo to do",
            productId: "",
            baseSendTime : requestData.CreateTime,
        };
        common.log(req.session['account'], "send to ExternalReCharge data = "+JSON.stringify(data2));
        common.log(req.session['account'], "send to OfficialCharge data = "+JSON.stringify(data));

        common.CommonURL(function (url) {
            url = url + "/ShopService/ExternalReCharge";
            request.post({url, body : JSON.stringify(data2) }, function (err, httpResponse, body) {
                var obj = JSON.parse(body); 
                
                if (httpResponse.statusCode != 200) {
                    common.log(req.session['account'], "connect ExternalReCharge fail statusCode = "+httpResponse.statusCode + "statusMessage : "+ httpResponse.statusMessage);
                    res.send({ code : -1, msg : "connect ExternalReCharge fail statusCode : "+ httpResponse.statusCode + "statusMessage : "+ httpResponse.statusMessage});
                    res.end();
                }
                else if (err) {
                    common.log(req.session['account'], err);
                    res.send({ code : -1, msg : err });
                    res.end();
                }
                else if (obj.retStatus.StatusCode !== 10000) {
                        common.log(req.session['account'], "send to ExternalReCharge error msg = "+obj.retStatus.StatusMsg + "error code = "+obj.retStatus.StatusCode);
                        res.send({ code : -1, msg : obj.retStatus.StatusMsg });
                        res.end();
                }
                else {
                    common.ChargeURL(function (url) {//存摺
                        url = url + "/OfficialCharge";
                        request.post({ url, body: JSON.stringify(data) }, function (err, httpResponse, body) {
                            if (httpResponse.statusCode != 200) {
                                common.log(req.session['account'], "connect OfficialCharge fail statusCode = "+httpResponse.statusCode + "statusMessage : "+ httpResponse.statusMessage);
                                res.send({ code : -1, msg : "connect OfficialCharge fail statusCode : "+ httpResponse.statusCode + "statusMessage : "+ httpResponse.statusMessage});
                                res.end();
                            }
                            else if (err) {
                                common.log(req.session['account'], "send to OfficialCharge error msg = "+err);
                                res.send({ code : -1, msg : err });
                                res.end();
                            }
                            else {
                                res.send({ code : 0, msg : "手動補儲成功!!" });
                                res.end();
                            }                       
                        });
                    });
                }                    
            });
        });
        

    });  
});

module.exports = router;