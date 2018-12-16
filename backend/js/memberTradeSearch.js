var express = require('express');
var path = require("path");
var router = express.Router();
var async = require("async");
router.get('/BulletinTradeSearchForm', function (req, res) {
    common.log(req.session['account'], 'call BulletinTradeSearchForm');
    common.CreateHtml("BulletinTradeSearchForm", req, res);
});

router.post('/MemberTradeSearch', function (req, res) {
    var Page = req.body.start;
    var Limit = req.body.length;
    common.CreateHtml("MemberTradeSearch", req, res, function () {
        common.SCGConnection(res, function (err, connection) {
            var str = "SELECT * FROM Account.TopUpInfo WHERE MemberId = " + connection.escape(req.body.MemberId);

            if (req.body.TradeSeq != null) {
                str = str + " AND FacTradeSeq like " + connection.escape("%" + req.body.TradeSeq + "%");
            }
            if (req.body.MemberDepositTimeStart != null && req.body.MemberDepositTimeEnd != null) {
                str = str + " AND CreateTime BETWEEN " + connection.escape(req.body.MemberDepositTimeStart) + " AND " + connection.escape(req.body.MemberDepositTimeEnd);
            }
            if (req.body.TradeType != null) {
                str = str + " AND CashFlow = " + connection.escape(req.body.TradeType);
            }

            str += " LIMIT " + Page + " , " + Limit;
            common.log(req.session['account'], str);
            getTableCount(res, req.body, function(count) {
                connection.query(str, function (error, dbresults, fields) {
                    connection.release();
                    if (error) throw error;
                    res.send({ recordsTotal: count, recordsFiltered: count, data: dbresults });
                    res.end();
                });
            });
        });
    });
});

function getTableCount(res, data, callback) {
    common.SCGConnection(res, function(err, connection) {
        if (err) {
            res.send({ code: "-1", msg: "連線失敗" });
            res.end();
        }

        
        var sql = "SELECT COUNT(*) FROM Account.TopUpInfo WHERE MemberId = " + connection.escape(data.MemberId);
        
        if (data.TradeSeq != null) {
            sql = sql + " AND FacTradeSeq like " + connection.escape("%" + data.TradeSeq + "%");
        }
        if (data.MemberDepositTimeStart != null && data.MemberDepositTimeEnd != null) {
            sql = sql + " AND CreateTime BETWEEN " + connection.escape(data.MemberDepositTimeStart) + " AND " + connection.escape(data.MemberDepositTimeEnd);
        }
        if (data.TradeType != null) {
            sql = sql + " AND CashFlow = " + connection.escape(data.TradeType);
        }
        
        connection.query(sql, function(err, result) {
            if (err) {
                throw err;
                res.send({ code: "-1", msg: "失敗" });
            } else {
            }

            connection.release();
            callback(result[0]["COUNT(*)"]);
        });
    });
}

module.exports = router;