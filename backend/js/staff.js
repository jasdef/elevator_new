var express = require('express');
var router = express.Router();

router.get('/ShowStaffServiceList', function (req, res) {
    common.log(req.session['account'], 'call ShowStaffServiceList');
    common.CreateHtml("ShowStaffServiceList", req, res);
});

router.get('/StaffList', function (req, res) {
    common.log(req.session['account'], 'call StaffList');
    common.CreateHtml("StaffList", req, res);
});

router.get('/ShowStaffWarrantyList', function (req, res) {
    common.log(req.session['account'], 'call ShowStaffWarrantyList');
    common.CreateHtml("ShowStaffWarrantyList", req, res);
});

router.post('/GetStaffList', function (req, res) {
    common.CreateHtml("staff_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            
            var dataSelect = "select * from account where autho='staff';";
            var countSelect = "select COUNT(*) as count from account where autho='staff';";

   
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

router.post('/GetOwnerWarrabtyList', function (req, res) {
    common.CreateHtml("staff_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
           
            var staffID = req.body.Id;
            
            var dataSelect = "select a.id, a.title, a.start_date, a.free_maintenance, b.company, b.tel1, b.address1 from warranty_form as a, customer as b where a.customer_id = b.id and a.is_delete=0 and a.staff_id="+staffID+";";
            var countSelect = "select COUNT(*) as count from warranty_form as a, customer as b where a.customer_id = b.id and a.is_delete=0 and a.staff_id="+staffID+";";
   
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

router.post('/GetOwnerServiceList', function (req, res) {
    common.CreateHtml("staff_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var staffID = req.body.Id;
            
            var dataSelect = "select a.id, b.company, a.start_date, a.total_price, a.left_price from service_form as a, customer as b where a.customer_id = b.id and a.is_delete=0 and a.staff_id="+staffID+";";
            var countSelect = "select COUNT(*) as count from service_form as a, customer as b where a.customer_id = b.id and a.is_delete=0 and a.staff_id="+staffID+";";
   
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

module.exports = router;