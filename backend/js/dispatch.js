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

router.post('/AddDispatch', function(req, res) {
    common.CreateHtml("Dispatch_Transfer", req, res, function (err) {
    common.BackendConnection(res, function(err, connection) {
            var requestData = JSON.parse(req.body.requestData);

            var addDispatchSQL = "insert into dispatch_log (`table_type`, `table_id`, `dispatcher`, `principal`) VALUES (?,?,?,?);";

            var dispatchData = 
            [
                requestData.tableType, 
                requestData.tableID,
                req.session['authid'],
                requestData.staffID,
            ];
  
            addDispatchSQL = connection.format(addDispatchSQL, dispatchData);

            var sql = addDispatchSQL;

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