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