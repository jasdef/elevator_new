var express = require('express');
var router = express.Router();

router.get('/ModifyPhoneSearch', function(req, res){
    common.log(req.session['account'], 'call ModifyPhoneSearch');
    common.CreateHtml("ModifyPhoneSearch", req, res);
});

router.post('/GetAllModifyNumData', function(req, res){
    common.CreateHtml("ModifyPhoneSearch_Transfer", req, res, function(err) {
        common.SCGConnection(res, function(err, connection) {
            var countSQL = "select count(*) as count from ModifyPhoneNumHistory; ";
            var sql = "select t1.MemberId,`NickName`,`NumBefore`,`NumAfter`,`Author`,`Note`,t1.ModifyTime from ModifyPhoneNumHistory t1, Member t2 where t1.MemberId = t2.MemberId";
            // ORDER
          //  var orderColumn = connection.escapeId(req.body["columns[" + req.body['order[0][column]'] + "][data]"]);
          //  var orderSQL = ' ORDER BY ' + orderColumn + ' ' + (req.body["order[0][dir]"] == "asc" ? "ASC" : "DESC");
            // LIMIT
          //  var limitSQL = ' LIMIT ' + connection.escape(Number(req.body.start)) + ', ' + connection.escape(Number(req.body.length));

            //sql = countSQL + sql + orderSQL + limitSQL + ";";
            sql = countSQL + sql + ";";
            common.log(req.session['account'], sql);
            var query = connection.query(sql, function (error, result, fields) {
                if (error) 
                {
                    common.log(req.session['account'], error);
                    res.send({ error: err });
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