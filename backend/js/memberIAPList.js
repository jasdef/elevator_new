var express = require('express');
var path = require("path");
var router = express.Router();


router.get('/memberIAPListform', function (req, res) {
    common.CreateHtml("memberIAPListform", req, res);
});
/*
router.post('/memberIAPList', function (req, res) {
    common.SCGConnection(function (err, connection) {
        if (err) throw err;
        connection.query("SELECT a.MemberId, a.ModifyTime, b.ShopItemName, b.Coin FROM SCGGame.MemberShopHistory a JOIN SCGGame.ShopItems b ON a.ShopItemId = b.ShopItemId where a.MemberId like ?", [req.body.MemberId] + "%", function (error, dbresults, fields) {
            connection.release();
            if (error) throw error;
            res.send({ data: dbresults });
            res.end();
        });
    });
});
*/
router.post('/memberIAPListAdv', function (req, res) {
    common.CreateHtml("memberIAPListAdv", req, res, function (err) {
        if (err) {
            res.status(err).send();
            res.end();
            return;
        }
        common.SCGConnection(function (err, connection) {
            if (err) throw err;
            connection.query("SELECT a.MemberId, a.ModifyTime, b.ShopItemName, b.Coin  FROM SCGGame.MemberShopHistory a JOIN SCGGame.ShopItems b ON a.ShopItemId = b.ShopItemId where  a.MemberId = ? AND a.ModifyTime between ? AND ? AND b.Coin <= ? AND b.Coin >= ? ", [req.body.MemberId, req.body.startDate, req.body.EndDate, req.body.upLimitPrise, req.body.downLimitPrise], function (error, dbresults, fields) {
                connection.release();
                if (error) throw error;
                res.send({ data: dbresults });
                res.end();
            });
        });
    });
});


module.exports = router;