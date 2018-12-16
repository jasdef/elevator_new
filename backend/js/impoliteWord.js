var express = require('express');
var path = require("path");
var router = express.Router();
var request = require('request');


router.get('/ImpoliteWord', function (req, res) {
    common.log(req.session['account'], 'call ImpoliteWord');
    common.CreateHtml("ImpoliteWord", req, res);
});

router.post('/UpdateImpoliteWordType', function (req, res){
    common.CreateHtml("ImpoliteWordTransfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var SendData = JSON.parse(req.body.SendData);
            var impoliteID = SendData.impoliteID;
            var insertTypeArr = SendData.insertType;
            var deleteSQL = "delete from ViolationTypeImpoliteWord  where ImpoliteWordId = "+impoliteID+";";
            var insertSQL = "";
            var insertValue = "";

            if (insertTypeArr !== "")
            {
                var i;
                for (i = 0; i < insertTypeArr.length; i++) {
                    if (i === insertTypeArr.length - 1) {
                        insertValue += "("+impoliteID+","+insertTypeArr[i]+")";
                    }
                    else {
                        insertValue += "("+impoliteID+","+insertTypeArr[i]+"),";
                    }
                }
                insertSQL = "insert into ViolationTypeImpoliteWord (ImpoliteWordId, ViolationTypeId) VALUES "+insertValue+";";
            }            
                                  
            var sql = deleteSQL+insertSQL;
            var query = connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({ code: error, msg: "修改失敗", err: error });
                } else {
                                       
                    res.send({ code: 0, msg: "修改成功" });
                }
                connection.release();
                res.end();
            });

        });
    });
});

router.post('/DeleteImpoliteWord', function (req, res){
    common.CreateHtml("ImpoliteWordTransfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var impoliteID = req.body.Id;
            var deleteType = "delete from ViolationTypeImpoliteWord where ImpoliteWordId = "+impoliteID+";";
            var deleteImpolite = "delete from ImpoliteWord where id = "+impoliteID+";";
            var sql = deleteType+deleteImpolite;

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


router.post('/AddImpoliteWord', function (req, res) {
    common.CreateHtml("ImpoliteWordTransfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            var SendData = JSON.parse(req.body.SendData);
            var addWordArr = SendData.addWordArr;
            //var addWordArr;
            var typeArr = SendData.typeArr;
            var selectSQL = "select keyword from ImpoliteWord where keyword in (?)";
            var sql = "";            
        
            selectSQL = connection.format(selectSQL, [addWordArr]);
            
            common.log(req.session['account'], selectSQL);
            var query = connection.query(selectSQL, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: error, msg: "新增失敗(檢查不雅字失敗)", err: error }).end();
                } 
                else {
                      
                    var exsitKeyword = result;
                    var notExsitKeyword;
                    var i;
                    
                    if (typeof exsitKeyword != 'undefined') {
                        for (i = 0; i < addWordArr.length; i++) {
                            var add = true;
                            exsitKeyword.forEach(function (element) {
                                if (element.keyword === addWordArr[i]) {
                                    add = false;
                                }
                            });
                            
                            if (add) {
                                notExsitKeyword = [];
                                notExsitKeyword[notExsitKeyword.length] = addWordArr[i];
                            }
                        }
                    }
                    else {
                        notExsitKeyword = addWordArr;
                    }

                    if (typeof notExsitKeyword != 'undefined') {
                        var insertSQL = "insert into ImpoliteWord (Keyword) VALUES ";
                        var insertTypeSQL = "insert into ViolationTypeImpoliteWord (ImpoliteWordId, ViolationTypeId) VALUES ";
                        var impoliteTypeValue = "";
                        var i;
                        for(i = 0; i < typeArr.length; i++) {
                            if (i === typeArr.length - 1) {
                                impoliteTypeValue += "(LAST_INSERT_ID(),"+typeArr[i]+")";
                            }
                            else {
                                impoliteTypeValue += "(LAST_INSERT_ID(),"+typeArr[i]+"),";
                            }
                        }

                        insertTypeSQL += impoliteTypeValue+";";

                        for (i = 0; i < notExsitKeyword.length; i++) {
                            var impoliteValue = "("+connection.escape(notExsitKeyword[i])+");";
                            sql += insertSQL+impoliteValue+insertTypeSQL;   
                        }

                        common.log(req.session['account'], sql);
                        
                        connection.query(sql, function (error, result, fields) {
                            if (error) {
                                common.log(req.session['account'], error);
                                res.send({ code: error, msg: "新增失敗(新增不雅字失敗)", err: error });
                            }
                            else {
                                res.send({ code: 0, msg: "新增成功", data:exsitKeyword });
                            } 
                            connection.release();
                            res.end();
                        });
                    }
                    else {
                        res.send({ code: error, msg: "輸入的不雅字 已存在!", data:exsitKeyword});
                        connection.release();
                        res.end();
                    }              
                }
            });

        });
    });
});


router.post('/ImpoliteWordSearch', function (req, res) {
    common.CreateHtml("ImpoliteWordTransfer", req, res, function (err) {
        common.BackendConnection(res, function(err, connection) {
            
            var countSelect = 'SELECT COUNT(*) as count FROM';
            var dataSelect = 'SELECT a.Id, a.Keyword, GROUP_CONCAT(b.ViolationTypeId) AS ViolationTypeId FROM ImpoliteWord AS a JOIN ViolationTypeImpoliteWord AS b ON b.ImpoliteWordId = a.Id ';
            var searchData = JSON.parse(req.body.requestData);
            var chWordLength = 3;//中文字在資料庫的一個字長度
            var groupBy = " group by b.ImpoliteWordId";
            var whereSQL = "";

            if (parseInt(searchData.wordCount) !== 0) {
                whereSQL = whereSQL + " LENGTH(`Keyword`) = "+searchData.wordCount*chWordLength;
            }

            if (searchData.impoliteWord !== "") {

                if (whereSQL !== "") {
                    whereSQL = whereSQL + " AND `Keyword` like "+connection.escape("%"+searchData.impoliteWord+"%");                    
                }
                else {
                    whereSQL = whereSQL + "`Keyword` like "+connection.escape("%"+searchData.impoliteWord+"%");                    
                }
            }

            if (searchData.impoliteType !== "") {   
                if (whereSQL !== "") {
                    whereSQL = whereSQL + " AND ViolationTypeId IN ("+searchData.impoliteType+")";                               
                }
                else {
                    whereSQL = whereSQL + " ViolationTypeId IN ("+searchData.impoliteType+")";
                }             
            }

            if (whereSQL !== "")
                whereSQL = "where"+whereSQL;

            // ORDER
            var orderColumn = connection.escapeId(req.body["columns[" + req.body['order[0][column]'] + "][data]"]);
            var orderSQL = ' ORDER BY ' + orderColumn + ' ' + (req.body["order[0][dir]"] == "asc" ? "ASC" : "DESC");
            // LIMIT
            var limitSQL = ' LIMIT ' + connection.escape(Number(req.body.start)) + ', ' + connection.escape(Number(req.body.length));
           
            var dataSQL = dataSelect + whereSQL + groupBy + orderSQL + limitSQL;
            var countSQL = countSelect +"(" + dataSQL + ") as t;";
            var sql = countSQL + dataSQL+";";

            common.log(req.session['account'], sql);

            var query = connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({ error: err });
                } else {
                    var totallength = result[0][0].count;  
                    
                    result[1].forEach(function(element) {
                        element.typeName = "";   
                    });
                    
                    res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: result[1] });
                }
                connection.release();
                res.end();
            });

        });
    });

});

router.post('/GetTypeGroup', function (req, res) {
    common.CreateHtml("ImpoliteWordTransfer", req, res, function (err) {
        common.BackendConnection(res, function(err, connection) {

            var dataSelect = 'select `id`, `name` from ViolationType;';
            var sql = dataSelect;

            common.log(req.session['account'], sql);
           
            var query = connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({ error: err });
                } else {                   
                    res.send({code: "0", data: result });
                }
                connection.release();
                res.end();
            });

        });
    });

});


module.exports = router;