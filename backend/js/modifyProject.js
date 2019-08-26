var express = require('express');
var router = express.Router();


router.get('/ModifyProject', function(req, res) {
    common.log(req.session['account'], 'call ModifyProject');
    common.CreateHtml("ModifyProject", req, res);
});

router.get('/ModifyProjectAdd', function(req, res) {
    common.log(req.session['account'], 'call ModifyProject add');
    common.CreateHtml("ModifyProjectAdd", req, res);

});

router.get('/ModifyProjectEdit', function(req, res) {
    common.log(req.session['account'], 'call ModifyProject edit');
    common.CreateHtml("ModifyProjectEdit", req, res);

});

router.get('/ModifyProjectView', function(req, res) {
    common.log(req.session['account'], 'call ModifyProject view');
    common.CreateHtml("ModifyProjectView", req, res);

});

router.get('/ModifyProjectRemind', function(req, res) {
    common.log(req.session['account'], 'call ModifyProject remind');
    common.CreateHtml("ModifyProjectRemind", req, res);

});

router.post('/GetModifyProjectRemindList', function (req, res) {
    common.CreateHtml("ModifyProject_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from modify_project where is_delete=0 and left_price>0 and is_signing=0;";
            var countSelect = "select COUNT(*) as count from modify_project where is_delete=0 and left_price>0 and is_signing=0;";

   
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



router.post('/GetModifyProjectList', function (req, res) {
    common.CreateHtml("ModifyProject_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from modify_project where is_delete=0;";
            var countSelect = "select COUNT(*) as count from modify_project where is_delete=0;";

   
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

router.post('/GetModifyProjectData', function (req, res) {
    common.CreateHtml("ModifyProject_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var modifyProjectID = req.body.Id;
            
            var dataSelect = "select * from modify_project where id="+modifyProjectID+";";
   
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

router.post('/EditModifyProject', function(req, res) {
    common.CreateHtml("ModifyProject_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var editModifyProjectSQL = "update modify_project set `title`=?, `left_price`=?, `total_price`=?, `start_date`=?, `is_return`=?, `is_duty`=?, `is_receipt`=?, `elevator_num`=?, `note`=?, `customer_id`=?, `is_stamp`=?, `items`=? where `id`=?;";

            var itemsJson = JSON.stringify(requestData.items);
            var modifyProjectData = 
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
                requestData.isStamp,
                itemsJson,
                requestData.id
            ];
  
            editModifyProjectSQL = connection.format(editModifyProjectSQL, modifyProjectData);

            var sql = editModifyProjectSQL;

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

router.post('/AddModifyProject', function(req, res) {//4
    common.CreateHtml("ModifyProject_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addModifyProjectSQL = "insert into modify_project (`title`, `left_price`, `total_price`, `start_date`, `is_return`, `is_duty`, `is_receipt`, `elevator_num`, `note`, `customer_id`, `is_stamp`, `items`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";

            var itemsJson = JSON.stringify(requestData.items);
            var modifyProjectData = 
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
                requestData.isStamp,
                itemsJson
            ];
  
            addModifyProjectSQL = connection.format(addModifyProjectSQL, modifyProjectData);

            var sql = addModifyProjectSQL;

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


router.post('/DeleteModifyProject', function (req, res){
    common.CreateHtml("ModifyProject_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteModifyProject");

        common.BackendConnection(res, function (err, connection) {
            var modifyProjectID = req.body.Id;
            var deleteModifyProject = "update modify_project set `is_delete`=1 where `id` = "+modifyProjectID+";";
        
            var sql = deleteModifyProject;

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

module.exports = router;