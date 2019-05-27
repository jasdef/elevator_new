var express = require('express');
var router = express.Router();


router.get('/Dispatch', function(req, res) {
    common.log(req.session['account'], 'call Dispatch');
    common.CreateHtml("Dispatch", req, res);
});

router.get('/DispatchAdd', function(req, res) {
    common.log(req.session['account'], 'call Dispatch Add');
    common.CreateHtml("DispatchAdd", req, res);
});

router.get('/DispatchOwn', function(req, res) {
    common.log(req.session['account'], 'call Dispatch Own');
    common.CreateHtml("DispatchOwn", req, res);
});

router.post('/GetDispatchList', function (req, res) {
    common.CreateHtml("Dispatch_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from dispatch_log;";
            var countSelect = "select COUNT(*) as count from dispatch_log;";

   
            var sql = countSelect + dataSelect;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], err);
                    res.send({error : err});
                }
                else {
                    var totallength = result[0][0].count;

                    for(var i = 0; i < totallength; i++) {
                        if (result[1][i].table_type == 2) {
                            result[1][i].table_type_name = "保固單";
                        }
                        else {
                            result[1][i].table_type_name = "保養單";
                        }
                        result[1][i].title = "";

                    }


                    res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: result[1] });
                }
                connection.release();
                res.end();
            });

        });        
    });

});

router.post('/GetDispatchTW', function (req, res) {
    common.CreateHtml("DispatchOwn_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var data = req.body;
            var ownerID = req.session['authid'];

            var accountSelect = "select * from account where id="+data.dispatcher+";";
            accountSelect += "select * from account where id="+data.principal+";";

            var tableNameSelect = "";

            if (data.table_type == 2) {
                tableNameSelect = "select * from warranty_form where id="+data.table_id+";";
            }
            else {
                 tableNameSelect = "select * from service_form as a inner join warranty_form as b on a.warranty_id=b.id where a.id="+data.table_id+";";
            }
           
            var sql = accountSelect + tableNameSelect;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], err);
                    res.send({error : err});
                }
                else {
                    var dispatcher = result[1][0].name;
                    var principal = result[0][0].name;
                    var actionName = "確認完成";

                    if (data.dispatcher == result[0][0].id) {
                        dispatcher = result[0][0].name;
                        principal = result[1][0].name;
                    }


                    if (data.action_type == 1) {
                        actionName = "已派遣人員";
                    }
                    else if (data.action_type == 2) {
                        actionName = "尚未確認完成";
                    }
           
                    res.send({ tableName:result[2][0].title, dispatcher:dispatcher, principal:principal, actionName: actionName});
                }
                connection.release();
                res.end();
            });

        });        
    });

});

router.post('/UpdateDispatchStatus', function (req, res) {
    common.CreateHtml("DispatchOwn_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var actionType = req.body["actionType"];
            var id = req.body["id"];
            var statusUpdate = "update dispatch_log set action_type="+actionType+" where id="+id+";";               
            var sql = statusUpdate;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], err);
                    res.send({error : err});
                }
                else {
                    
                    res.send({ msg: "done!!" });
                }
                connection.release();
                res.end();
            });

        });        
    });

});


router.post('/GetOwnDispatchList', function (req, res) {
    common.CreateHtml("DispatchOwn_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var ownerID = req.session['authid'];

            var dataSelect = "select * from dispatch_log where action_type=1 and principal="+ownerID+";";
            var countSelect = "select COUNT(*) as count from dispatch_log where action_type=1 and principal="+ownerID+";";

   
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

router.post('/AddDispatch', function(req, res) {
    common.CreateHtml("Dispatch_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);

            var addDispatchSQL = "insert into dispatch_log (`table_type`, `table_id`, `dispatcher`, `principal`) VALUES (?,?,?,?);";
            var updateForm;
            if (requestData.tableType == 2) {//保固單
                updateForm = "update warranty_form set is_dispatch=1 where id="+requestData.tableID+";";
            }
            else {//保養單
                updateForm = "update service_form set is_dispatch=1 where id="+requestData.tableID+";";
            }


            var dispatchData = 
            [
                requestData.tableType, 
                requestData.tableID,
                req.session['authid'],
                requestData.staffID,
            ];
  
            addDispatchSQL = connection.format(addDispatchSQL, dispatchData);

            var sql = addDispatchSQL+updateForm;

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "派遣失敗", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "派遣成功!" }).end();
                }
            });

    });
    });
});




module.exports = router;