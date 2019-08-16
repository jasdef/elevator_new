var express = require('express');
var router = express.Router();

router.get('/FixForm', function(req, res) {
    common.log(req.session['account'], 'call FixForm');
    common.CreateHtml("FixForm", req, res);
});

router.get('/FixFormAdd', function(req, res) {
    common.log(req.session['account'], 'call FixForm add');
    common.CreateHtml("FixFormAdd", req, res);
});

router.get('/FixFormEdit', function(req, res) {
    common.log(req.session['account'], 'call FixForm edit');
    common.CreateHtml("FixFormEdit", req, res);
});

router.get('/FixFormView', function(req, res) {
    common.log(req.session['account'], 'call FixForm view');
    common.CreateHtml("FixFormView", req, res);
});

router.get('/FixFormStaffView', function(req, res) {
    common.log(req.session['account'], 'call FixForm staff view');
    common.CreateHtml("FixFormStaffView", req, res);
});

router.get('/FixFormRemind', function(req, res) {
    common.log(req.session['account'], 'call FixForm remind');
    common.CreateHtml("FixFormRemind", req, res);
});

router.post('/GetFixFormList', function (req, res) {
    common.CreateHtml("FixForm_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select a.id, b.company, a.total_price, a.left_price from fix_form as a, customer as b where a.customer_id = b.id and a.is_delete=0;";
            var countSelect = "select COUNT(*) as count from fix_form as a, customer as b where a.customer_id = b.id and a.is_delete=0;";

   
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

router.post('/GetFixFormData', function (req, res) {
    common.CreateHtml("staff_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var fixFormID = req.body.Id;
            
            var dataSelect = "select * from fix_form where id="+fixFormID+";";
   
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

router.post('/EditFixForm', function(req, res) {
    common.CreateHtml("FixForm_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            var editFixFormSQL = "update fix_form set `title`=?, `left_price`=?, `total_price`=?, `num`=?, `type`=?, `status`=?, `fix_item`=?, `note`=?, `items`=?, `staff_id`=?, `customer_id`=? where `id`=?;";

            var itemsJson = JSON.stringify(requestData.items);
            var fixFormData = 
            [
                requestData.title,
                requestData.leftPrice,   
                requestData.totalPrice,
                requestData.num,
                requestData.type,
                requestData.status,
                requestData.fixItem,
                requestData.note,
                itemsJson,
                requestData.staff,
                requestData.customerId,
                requestData.id
            ];
  
            editFixFormSQL = connection.format(editFixFormSQL, fixFormData);

            var sql = editFixFormSQL;

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

router.post('/GetFixFormRemindList', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select a.id, a.title, a.total_price, a.left_price, b.company from fix_form as a, customer as b where a.customer_id = b.id and a.is_delete=0 and left_price>0;";
            var countSelect = "select COUNT(*) as count  from fix_form as a, customer as b where a.customer_id = b.id and a.is_delete=0 and left_price>0;";

   
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

router.post('/AddFixForm', function(req, res) {//4
    common.CreateHtml("FixForm_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addFixFormSQL = "insert into fix_form (`title`, `left_price`, `total_price`, `num`, `type`, `status`, `fix_item`, `note`, `items`, `staff_id`, `customer_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?);";

            var itemsJson = JSON.stringify(requestData.items);
            var fixFormData = 
            [
                requestData.title,
                requestData.leftPrice,   
                requestData.totalPrice,
                requestData.num,
                requestData.type,
                requestData.status,
                requestData.fixItem,
                requestData.note,
                itemsJson,
                requestData.staff,
                requestData.customerId
            ];
  
            addFixFormSQL = connection.format(addFixFormSQL, fixFormData);

            var sql = addFixFormSQL;

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

router.post('/DeleteFixForm', function (req, res){
    common.CreateHtml("FixForm_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteFixForm");

        common.BackendConnection(res, function (err, connection) {
            var fixFormID = req.body.Id;
            var deleteFixForm = "update fix_form set `is_delete`=1 where `id` = "+fixFormID+";";
        
            var sql = deleteFixForm;

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