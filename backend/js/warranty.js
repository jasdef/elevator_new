var express = require('express');
var router = express.Router();


router.get('/Warranty', function(req, res) {
    common.log(req.session['account'], 'call Warranty');
    common.CreateHtml("Warranty", req, res);
});

router.get('/WarrantyAdd', function(req, res) {
    common.log(req.session['account'], 'call Warranty add');
    common.CreateHtml("WarrantyAdd", req, res);

});

router.get('/WarrantyEdit', function(req, res) {
    common.log(req.session['account'], 'call Warranty edit');
    common.CreateHtml("WarrantyEdit", req, res);

});

router.get('/WarrantyView', function(req, res) {
    common.log(req.session['account'], 'call Warranty view');
    common.CreateHtml("WarrantyView", req, res);

});

router.post('/GetWarrantyList', function (req, res) {
    common.CreateHtml("Warranty_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from warranty_form where is_delete=0;";
            var countSelect = "select COUNT(*) as count from warranty_form where is_delete=0;";

   
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

router.post('/GetWarrantyData', function (req, res) {
    common.CreateHtml("Warranty_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var warrantyID = req.body.Id;
            
            var dataSelect = "select * from warranty_form where id="+warrantyID+";";
   
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

router.post('/EditWarranty', function(req, res) {
    common.CreateHtml("Warranty_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var editWarrantySQL = "update warranty_form set `title`=?, `start_date`=?, `mechanical_warranty`=?, `transaction_id`=?, `free_maintenance`=?, `num`=?, `contactor1`=?, `contactor2`=?, `contactor3`=?, `tel1`=?, `tel2`=?, `tel3`=?, `address1`=?, `address2`=?, `address3`=?, `fax1`=?, `fax2`=?, `fax3`=? where `id`=?;";

          
            var warrantyData = 
            [
                requestData.title, 
                requestData.startDate,
                requestData.mechanical,
                requestData.transactionID,
                requestData.free,
                requestData.num,
                requestData.contactor1,
                requestData.contactor2,
                requestData.contactor3,
                requestData.tel1,
                requestData.tel2,
                requestData.tel3,
                requestData.address1,  
                requestData.address2,     
                requestData.address3,            
                requestData.fax1,            
                requestData.fax2,            
                requestData.fax3,
                requestData.id
            ];
  
            editWarrantySQL = connection.format(editWarrantySQL, warrantyData);

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

router.post('/AddWarranty', function(req, res) {//4
    common.CreateHtml("Warranty_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addWarrantySQL = "insert into warranty_form (`title`, `start_date`, `mechanical_warranty`, `transaction_id`, `free_maintenance`, `num`, `contactor1`, `contactor2`, `contactor3`, `tel1`, `tel2`, `tel3`, `address1`, `address2`, `address3`,`fax1`,`fax2`,`fax3`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

            
            var warrantyData = 
            [
                requestData.title, 
                requestData.startDate,
                requestData.mechanical,
                requestData.transactionID,
                requestData.free,
                requestData.num,
                requestData.contactor1,
                requestData.contactor2,
                requestData.contactor3,
                requestData.tel1,
                requestData.tel2,
                requestData.tel3,
                requestData.address1,  
                requestData.address2,     
                requestData.address3,            
                requestData.fax1,            
                requestData.fax2,            
                requestData.fax3
            ];
  
            addWarrantySQL = connection.format(addWarrantySQL, warrantyData);

            var sql = addWarrantySQL;

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


router.post('/DeleteWarranty', function (req, res){
    common.CreateHtml("Warranty_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteWarranty");

        common.BackendConnection(res, function (err, connection) {
            var warrantyID = req.body.Id;
            var deleteWarranty = "update warranty_form set `is_delete`=1 where `id` = "+warrantyID+";";
        
            var sql = deleteWarranty;

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