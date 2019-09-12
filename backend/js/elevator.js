var express = require('express');

var router = express.Router();

router.get('/Elevator', function(req, res) {
    common.log(req.session['account'], 'call Elevator');
    common.CreateHtml("Elevator", req, res);
});

router.get('/ElevatorAdd', function(req, res) {
    common.log(req.session['account'], 'call Elevator add');
    common.CreateHtml("ElevatorAdd", req, res);

});

router.get('/ElevatorEdit', function(req, res) {
    common.log(req.session['account'], 'call Elevator edit');
    common.CreateHtml("ElevatorEdit", req, res);

});

router.get('/ElevatorView', function(req, res) {
    common.log(req.session['account'], 'call Elevator view');
    common.CreateHtml("ElevatorView", req, res);

});

router.post('/GetElevatorList', function (req, res) {
    common.CreateHtml("Elevator_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select b.company, a.note, a.id, a.customer_id from elevator as a, customer as b where a.customer_id = b.id and a.is_delete=0;";
            var countSelect = "select COUNT(*) as count from elevator where is_delete=0;";

   
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

router.post('/GetCustomerElevatorList', function (req, res) {
    common.CreateHtml("Elevator_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var customerID = req.body.Id;

            var dataSelect = "select b.company, a.note, a.id, a.customer_id from elevator as a, customer as b where a.customer_id = b.id and a.customer_id="+customerID+" and a.is_delete=0;";
            var countSelect = "select COUNT(*) as count from elevator where customer_id="+customerID+" and is_delete=0;";

   
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

router.post('/GetElevatorData', function (req, res) {
    common.CreateHtml("staff_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var ElevatorID = req.body.Id;
            
            var dataSelect = "select * from elevator where id="+ElevatorID+";";
   
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

router.post('/EditElevator', function(req, res) {
    common.CreateHtml("Elevator_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            var editElevatorSQL = "update elevator set `horsepower`=?, `power`=?, `current`=?, `steel_cable_mm`=?, `steel_cable`=?, `kg`=?, `people`=?, `speed`=?, `lifting`=?, `floor`=?, `stop`=?,`exit`=?,`car_size`=?,`is_action`=?,`has_lifting`=?, `is_oil_lifting`=?, `is_fire`=?, `customer_id`=?, `note`=? where `id`=?;";

            var ElevatorData = 
            [
                requestData.horsepower,
                requestData.power,
                requestData.current,
                requestData.steelCableMM,
                requestData.steelCable,
                requestData.kg,
                requestData.people,
                requestData.speed,
                requestData.lifting,  
                requestData.floor,     
                requestData.stop,            
                requestData.exit,            
                requestData.carSize,            
                requestData.isAction,
                requestData.hasLifting,
                requestData.isOilLifting,
                requestData.isFire,
                requestData.customerID,
                requestData.note,
                requestData.id
            ];
  
            editElevatorSQL = connection.format(editElevatorSQL, ElevatorData);

            var sql = editElevatorSQL;

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

router.post('/AddElevator', function(req, res) {//4
    common.CreateHtml("Elevator_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addElevatorSQL = "insert into elevator (`horsepower`, `power`, `current`, `steel_cable_mm`, `steel_cable`, `kg`, `people`, `speed`, `lifting`, `floor`, `stop`,`exit`,`car_size`,`is_action`,`has_lifting`, `is_oil_lifting`, `is_fire`, `customer_id`, `note`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

            var ElevatorData = 
            [
                requestData.horsepower,
                requestData.power,
                requestData.current,
                requestData.steelCableMM,
                requestData.steelCable,
                requestData.kg,
                requestData.people,
                requestData.speed,
                requestData.lifting,  
                requestData.floor,     
                requestData.stop,            
                requestData.exit,            
                requestData.carSize,            
                requestData.isAction,
                requestData.hasLifting,
                requestData.isOilLifting,
                requestData.isFire,
                requestData.customerID,
                requestData.note
            ];
  
            addElevatorSQL = connection.format(addElevatorSQL, ElevatorData);

            var sql = addElevatorSQL;

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


router.post('/DeleteElevator', function (req, res){
    common.CreateHtml("Elevator_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteElevator");

        common.BackendConnection(res, function (err, connection) {
            var ElevatorID = req.body.Id;
            var deleteElevator = "update elevator set `is_delete`=1 where `id`="+ElevatorID+";";            
            var sql = deleteElevator;

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