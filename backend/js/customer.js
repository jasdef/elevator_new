var express = require('express');
var path = require("path");
var router = express.Router();
var fileUpload = require('express-fileupload');
var async = require('async');
var request = require('request');

router.get('/Customer', function(req, res) {
    common.log(req.session['account'], 'call Customer');
    common.CreateHtml("Customer", req, res);
});

router.get('/CustomerAdd', function(req, res) {
    common.log(req.session['account'], 'call Customer add');
    common.CreateHtml("CustomerAdd", req, res);

});

router.get('/CustomerEdit', function(req, res) {
    common.log(req.session['account'], 'call Customer edit');
    common.CreateHtml("CustomerEdit", req, res);

});

router.get('/CustomerView', function(req, res) {
    common.log(req.session['account'], 'call Customer view');
    common.CreateHtml("CustomerView", req, res);

});

router.post('/GetCustomerList', function (req, res) {
    common.CreateHtml("Customer_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from customer where is_delete=0;";
            var countSelect = "select COUNT(*) as count from customer  where is_delete=0;";

   
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

router.post('/GetCustomerData', function (req, res) {
    common.CreateHtml("staff_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var CustomerID = req.body.Id;
            
            var dataSelect = "select * from customer where id="+CustomerID+";";
   
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

router.post('/EditCustomer', function(req, res) {
    common.CreateHtml("Customer_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            var editCustomerSQL = "update customer set `company`=?, `num`=?, `contactor1`=?, `contactor2`=?, `contactor3`=?, `tel1`=?, `tel2`=?, `tel3`=?, `address1`=?, `address2`=?, `address3`=?, `fax1`=?, `fax2`=?, `fax3`=?, `note`=? where `id`=?;";

            var CustomerData = 
            [
                requestData.company,
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
                requestData.note,
                requestData.id
            ];
  
            editCustomerSQL = connection.format(editCustomerSQL, CustomerData);

            var sql = editCustomerSQL;

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

router.post('/AddCustomer', function(req, res) {//4
    common.CreateHtml("Customer_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addCustomerSQL = "insert into customer (`company`, `num`, `contactor1`, `contactor2`, `contactor3`, `tel1`, `tel2`, `tel3`, `address1`, `address2`, `address3`,`fax1`,`fax2`,`fax3`,`note`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

            var CustomerData = 
            [
                requestData.company,
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
                requestData.note
            ];
  
            addCustomerSQL = connection.format(addCustomerSQL, CustomerData);

            var sql = addCustomerSQL;

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


router.post('/DeleteCustomer', function (req, res){
    common.CreateHtml("Customer_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteCustomer");

        common.BackendConnection(res, function (err, connection) {
            var CustomerID = req.body.Id;
            var deleteCustomer = "update customer set `is_delete`=1 where `id`="+CustomerID+";";            
            var sql = deleteCustomer;

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