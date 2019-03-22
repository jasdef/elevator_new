var express = require('express');
var router = express.Router();


router.get('/Service', function(req, res) {
    common.log(req.session['account'], 'call Service');
    common.CreateHtml("Service", req, res);
});

router.get('/ServiceAdd', function(req, res) {
    common.log(req.session['account'], 'call Service add');
    common.CreateHtml("ServiceAdd", req, res);

});

router.get('/ServiceEdit', function(req, res) {
    common.log(req.session['account'], 'call Service edit');
    common.CreateHtml("ServiceEdit", req, res);

});

router.get('/ServiceView', function(req, res) {
    common.log(req.session['account'], 'call Service view');
    common.CreateHtml("ServiceView", req, res);

});

router.post('/GetServiceList', function (req, res) {
    common.CreateHtml("Service_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from service_form where is_delete=0;";
            var countSelect = "select COUNT(*) as count from service_form where is_delete=0;";

   
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

router.post('/GetServiceData', function (req, res) {
    common.CreateHtml("Service_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var serviceID = req.body.Id;
            
            var dataSelect = "select * from service_form where id="+serviceID+";";
   
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

router.post('/EditService', function(req, res) {
    common.CreateHtml("Service_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var editServiceSQL = "update service_form set `start_date`=?, `left_price`=?, `total_price`=?, `note`=?, `warranty_id`=?, `mechanical_warranty`=?, `service_month`=?, `has_license`=?, `license_date`=?, `items`=? where `id`=?;";

            var itemsJson = JSON.stringify(requestData.items);
            var serviceData = 
            [
                requestData.startDate,
                requestData.leftPrice,   
                requestData.totalPrice,
                requestData.note,
                requestData.warrantyID,
                requestData.mechanicalWarranty,
                requestData.serviceMonth,
                requestData.hasLicense,
                requestData.licenseDate,
                itemsJson,
                requestData.id
            ];
  
            editServiceSQL = connection.format(editServiceSQL, serviceData);

            var sql = editServiceSQL;

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

router.post('/AddService', function(req, res) {//4
    common.CreateHtml("Service_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addServiceSQL = "insert into service_form (`start_date`, `left_price`, `total_price`, `note`, `warranty_id`, `mechanical_warranty`, `service_month`, `has_license`, `license_date`, `items`) VALUES (?,?,?,?,?,?,?,?,?,?);";

            var itemsJson = JSON.stringify(requestData.items);
            var serviceData = 
            [
                requestData.startDate,
                requestData.leftPrice,   
                requestData.totalPrice,
                requestData.note,
                requestData.warrantyID,
                requestData.mechanicalWarranty,
                requestData.serviceMonth,
                requestData.hasLicense,
                requestData.licenseDate,
                itemsJson
            ];
  
            addServiceSQL = connection.format(addServiceSQL, serviceData);

            var sql = addServiceSQL;

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


router.post('/DeleteService', function (req, res){
    common.CreateHtml("Service_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteService");

        common.BackendConnection(res, function (err, connection) {
            var serviceID = req.body.Id;
            var deleteService = "update service_form set `is_delete`=1 where `id` = "+serviceID+";";
        
            var sql = deleteService;

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