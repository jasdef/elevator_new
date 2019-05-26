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
                    res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: result[1] });
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