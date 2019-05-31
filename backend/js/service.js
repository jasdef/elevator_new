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

router.get('/ServiceStaffView', function(req, res) {
    common.log(req.session['account'], 'call Service staff view');
    common.CreateHtml("ServiceStaffView", req, res);
});

router.get('/ServiceRemind', function(req, res) {
    common.log(req.session['account'], 'call Service remind');
    common.CreateHtml("ServiceRemind", req, res);
});

router.get('/ServiceSigning', function(req, res) {
    common.log(req.session['account'], 'call Service signing');
    common.CreateHtml("ServiceSigning", req, res);
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
    common.CreateHtml("staff_Transfer", req, res, function (err) {
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
            var editServiceSQL = "update service_form set `start_date`=?, `left_price`=?, `total_price`=?, `note`=?, `warranty_id`=?, `mechanical_warranty`=?, `service_month`=?, `has_license`=?, `license_date`=?, `items`=?, `do_times`=? where `id`=?;";

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
                requestData.doTimes,
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

router.post('/CheckServiceRemind', function(req, res) {
    common.CreateHtml("Service_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
   
            var sql = "select * from service_form where is_remind=0 and is_delete=0;";

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, err: error }).end();

                }
                else if (result.length > 0){
                    var data = result;
                    var updateRemindStatus = "";
                    for (var i = 0; i < data.length; i++) {
                        var tempTime = new Date(data[i].start_date);
                        if (tempTime < new Date()) {                 
                            var startMonth = tempTime.toLocaleString().split("-")[1];                           
                            var dispatchMonth = data[i].dispatch_month;

                            if (dispatchMonth == 0) {//for第一次
                                dispatchMonth = startMonth;
                              //  var totalTimes = data[i].mechanical_warranty * 12 / data[i].service_month * data[i].do_times; 
                                updateRemindStatus += "update service_form set is_remind=1, dispatch_month="+dispatchMonth+" where id="+data[i].id+" and is_delete=0;";
                            }
                            else {
                                updateRemindStatus += `update service_form set is_remind=1 where id=`+data[i].id+" and is_delete=0;";
                            }                           
                        }
                    }
                    
                    if (updateRemindStatus != "") {
                        common.log("System", updateRemindStatus);
                        connection.query(updateRemindStatus, function (error, result, fields) {
                            if (error) {
                                common.log(req.session['account'], error);
                                res.send({error : error});
                            }
                            
                            res.send({ msg: "done" });
                            connection.release();
                            res.end();
    
                        });
                    }
                    else {

                        common.log("System", "no need to remind warranty");
                        res.send({ msg: "done" });
                        connection.release();
                        res.end();
                    }
                }
                else {
                    res.send({ msg: "done" });
                    connection.release();
                    res.end();
                }
            });
        });
    });
});

router.post('/GetServiceRemindList', function (req, res) {
    common.CreateHtml("Service_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var nowMonth = new Date().toLocaleString().split("-")[1];

            var dataSelect = "select a.id, a.mechanical_warranty, a.do_times, a.service_month, a.start_date, b.title, a.service_times from service_form as a inner join warranty_form as b on a.warranty_id=b.id where a.is_delete=0 and a.is_remind=1 and a.is_dispatch=0 and a.dispatch_month="+nowMonth+";";
            var countSelect = "select COUNT(*) as count from service_form as a inner join warranty_form as b on a.warranty_id=b.id where a.is_delete=0 and a.is_remind=1 and a.is_dispatch=0 and a.dispatch_month="+nowMonth+";";   
            var sql = countSelect + dataSelect;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({error : error});
                }
                else {
                    var totallength = result[0][0].count;

                    for (var i = 0; i < totallength; i++) {               
                        var needDoTimes = result[1][i].mechanical_warranty * 12 / result[1][i].service_month * result[1][i].do_times; 
                        result[1][i].total_times = needDoTimes;                    
                    }

                    res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: result[1] });
                }
                connection.release();
                res.end();
            });

        });        
    });

});

router.post('/AddServiceByWarrantyID', function(req, res) {
    common.CreateHtml("Service_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var warrantyID = req.body["warrantyID"];
            var addServiceSQL = "insert into service_form (`warranty_id`) VALUES (?);";
            var getId = "SELECT LAST_INSERT_ID() as service_id;";
            var serviceData = 
            [
                warrantyID
            ];
  
            addServiceSQL = connection.format(addServiceSQL, serviceData);

            var sql = addServiceSQL+getId;

            common.log(req.session['account'], sql);
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    connection.release();                    
                    res.send({ code: -1, msg: "新增失敗", err: error }).end();

                }
                else {
                    connection.release();                    
                    res.send({ code: 0, msg: "新增成功!", id:result[1][0].service_id }).end();
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
            var addServiceSQL = "insert into service_form (`start_date`, `left_price`, `total_price`, `note`, `warranty_id`, `mechanical_warranty`, `service_month`, `has_license`, `license_date`, `items`, `do_times`) VALUES (?,?,?,?,?,?,?,?,?,?,?);";

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
                requestData.doTimes
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

router.post('/UpdateSigningServiceStatus', function(req, res) {
    common.CreateHtml("Service_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
  
            var tableID = req.body["tableID"];      
            var status = req.body["status"];
            var editWarrantySQL = "update service_form set `is_signing`= "+status+" where `id`="+tableID+";";
            var sql = editWarrantySQL;

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

router.post('/GetServiceSigningList', function (req, res) {
    common.CreateHtml("Warranty_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }

            var dataSelect = "select * from service_form where is_delete=0 and is_signing=1;";
            var countSelect = "select COUNT(*) as count from service_form where is_delete=0 and is_signing=1;";

   
            var sql = countSelect + dataSelect;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({error : error});
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

module.exports = router;