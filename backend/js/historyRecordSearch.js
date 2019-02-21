var express = require('express');
var path = require("path");
var router = express.Router();
var crypto = require('crypto');
var salt = "jumbo.net";
var async = require("async");


router.get('/HistoryRecordSearch', function (req, res) {
    common.log(req.session['account'], 'call HistoryRecordSearch');
    common.CreateHtml("HistoryRecordSearch", req, res);
});

router.post('/GetOperateData', function (req, res) {
    common.CreateHtml("HistoryRecordSearch_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select account,operator,modifytime from account t1, behavior_log t2 where t1.id = t2.account_id";
            var countSelect = "select COUNT(`account`) as count from account t1, behavior_log t2 where t1.id = t2.account_id";
            var whereSQL = "";
            var searchData = JSON.parse(req.body.requestData);
         //   var quickSearchSQL = "";


            if (searchData.Account !== "") {
                
                whereSQL = whereSQL + " AND account like " + connection.escape("%" + searchData.Account + "%");
            }
            
            if (searchData.OperateContent !== "") {
                
                whereSQL = whereSQL + " AND operator like " + connection.escape("%" + searchData.OperateContent + "%");
            }

            if (searchData.HistoryTimeStart !== "" && searchData.HistoryTimeEnd !== "") {
                
                whereSQL = whereSQL + " AND modifytime BETWEEN "+connection.escape(searchData.HistoryTimeStart) +" AND "+connection.escape(searchData.HistoryTimeEnd);
            }
                            
       /*     if (req.body["columns[0][search][value]"] !== "") {

                quickSearchSQL = quickSearchSQL + "where account like " + connection.escape("%" + req.body["columns[0][search][value]"] + "%");
            }

            if (req.body["columns[1][search][value]"] !== "") {
                quickSearchSQL = quickSearchSQL + " OR operator like " + connection.escape("%" + req.body["columns[1][search][value]"] + "%");
            }
            
            if (req.body["columns[2][search][value]"] !== "") {
                quickSearchSQL = quickSearchSQL + " OR modifytime like " + connection.escape("%" + req.body["columns[2][search][value]"] + "%");
            }*/

            //ORDER
            var orderColumn = connection.escapeId(req.body["columns[" + req.body['order[0][column]'] + "][data]"]);
            var orderSQL = ' ORDER BY ' + orderColumn + ' ' + (req.body["order[0][dir]"] == "asc" ? "ASC" : "DESC");
            // LIMIT
            var limitSQL = ' LIMIT ' + connection.escape(Number(req.body.start)) + ', ' + connection.escape(Number(req.body.length));
            
            var countSQL =  countSelect + whereSQL + ";";         
            var dataSQL =  dataSelect + whereSQL+orderSQL+limitSQL+";";   
           
          /*  if (quickSearchSQL !== "") {
                dataSQL = "select r.account, r.operator, r.modifytime from ("+dataSQL+") as r "+quickSearchSQL+";";
            }
            else {
                dataSQL = dataSQL +";";
            }
            dataSQL = dataSQL +";";*/
            var sql = countSQL + dataSQL;

            common.log(req.session['account'], sql);

            var query = connection.query(sql, function (error, result, fields) {
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


router.post('/InsertOperateLog', function (req, res) {
    var account = req.body.account;
    var operateContent = req.body.operateContent;

    common.BackendConnection(res, function (err, connection) {
        var sql = "Insert into behavior_log (account_id, operator) ?";
        var accountName;
        var subSql;
        if (account == NULL || account == "") {   
            accountName = "system";//System            
            throw "the account is null or empty!";
        }

        subSql = "select id "+operateContent +" from account where account = "+account;                    

        sql = connection.format(sql, [subSql]);
        connection.query(sql, function(err, dbresults, fields){
            if (err) {
                throw err;
                res.send({ code: "-1", msg: "失敗"});                
            }
            else {
                res.send({code: "0", msg: "成功", data: dbresults});                
            }
            connection.release();
            res.end();
        });
    });

});


module.exports = router;