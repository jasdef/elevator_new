var express = require('express');
var router = express.Router();


router.get('/Transaction', function(req, res) {
    common.log(req.session['account'], 'call Transaction');
    common.CreateHtml("Transaction", req, res);
});

router.get('/TransactionAdd', function(req, res) {
    common.log(req.session['account'], 'call Transaction add');
    common.CreateHtml("TransactionAdd", req, res);

});

router.get('/TransactionEdit', function(req, res) {
    common.log(req.session['account'], 'call Transaction edit');
    common.CreateHtml("TransactionEdit", req, res);

});

router.get('/TransactionView', function(req, res) {
    common.log(req.session['account'], 'call Transaction view');
    common.CreateHtml("TransactionView", req, res);

});

router.get('/TransactionRemind', function(req, res) {
    common.log(req.session['account'], 'call Transaction remind');
    common.CreateHtml("TransactionRemind", req, res);

});

router.get('/TransactionSigning', function(req, res) {
    common.log(req.session['account'], 'call Transaction add');
    common.CreateHtml("TransactionSigning", req, res);

});

router.post('/CancelWarranty', function(req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
           
            var transactionID = req.body.Id;         
            var editTransactionSQL = "update transaction_form set `is_signing`=2  where `id`="+transactionID+";"; 
            var sql = editTransactionSQL;

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


router.post('/CreateWarranty', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var transactionID = req.body.Id;
            var customerId = req.body.CustomerID;
            var m = req.body.Mechanical;
            var free = req.body.Free;
            var updateTransaction = "update transaction_form set `is_signing`=1 where id="+transactionID+";";
            var insertWarranty = "insert into warranty_form (`transaction_id`, `customer_id`, `mechanical_warranty`, `free_maintenance`) values("+transactionID+", "+customerId+", "+m+", "+free+");";
            var getId = "SELECT LAST_INSERT_ID() as warranty_id;"

   
            var sql = updateTransaction + insertWarranty + getId;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], err);
                    res.send({code: -1, error : err, msg: "創建失敗"});
                }
                else {                    
                    console.log(result);
                    res.send({code: 0, msg: "創建成功!", id:result[2][0].warranty_id});
                }
                connection.release();
                res.end();
            });

        });        
    });

});


router.post('/GetCreateWarrantyList', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from transaction_form where is_delete=0 and left_price=0 and is_signing=0;";
            var countSelect = "select COUNT(*) as count from transaction_form where is_delete=0 and left_price=0 and is_signing=0;";

   
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

router.post('/GetTransactionRemindList', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from transaction_form where is_delete=0 and left_price>0 and is_signing=0;";
            var countSelect = "select COUNT(*) as count from transaction_form where is_delete=0 and left_price>0 and is_signing=0;";

   
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



router.post('/GetTransactionList', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from transaction_form where is_delete=0;";
            var countSelect = "select COUNT(*) as count from transaction_form where is_delete=0;";

   
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

router.post('/GetTransactionData', function (req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var transactionID = req.body.Id;
            
            var dataSelect = "select * from transaction_form where id="+transactionID+";";
   
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

router.post('/EditTransaction', function(req, res) {
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var editTransactionSQL = "update transaction_form set `title`=?, `left_price`=?, `total_price`=?, `start_date`=?, `is_return`=?, `is_duty`=?, `is_receipt`=?, `elevator_num`=?, `note`=?, `customer_id`=?, `is_stamp`=?, `mechanical_warranty`=?, `free_maintenance`, `items`=? where `id`=?;";

            var itemsJson = JSON.stringify(requestData.items);
            var transactionData = 
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
                requestData.mechanical,
                requestData.free,
                itemsJson,
                requestData.id
            ];
  
            editTransactionSQL = connection.format(editTransactionSQL, transactionData);

            var sql = editTransactionSQL;

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

router.post('/AddTransaction', function(req, res) {//4
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);
            console.log(req.body);
            console.log(requestData);
            var addTransactionSQL = "insert into transaction_form (`title`, `left_price`, `total_price`, `start_date`, `is_return`, `is_duty`, `is_receipt`, `elevator_num`, `note`, `customer_id`, `is_stamp`, `mechanical_warranty`, `free_maintenance`, `items`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

            var itemsJson = JSON.stringify(requestData.items);
            var transactionData = 
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
                requestData.mechanical,
                requestData.free,
                itemsJson
            ];
  
            addTransactionSQL = connection.format(addTransactionSQL, transactionData);

            var sql = addTransactionSQL;

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


router.post('/DeleteTransaction', function (req, res){
    common.CreateHtml("Transaction_Transfer", req, res, function (err) {
        common.log(req.session['account'], "Call DeleteTransaction");

        common.BackendConnection(res, function (err, connection) {
            var transactionID = req.body.Id;
            var deleteTransaction = "update transaction_form set `is_delete`=1 where `id` = "+transactionID+";";
        
            var sql = deleteTransaction;

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