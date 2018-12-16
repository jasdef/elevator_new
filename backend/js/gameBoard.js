var express = require('express');
var router = express.Router();
var http = require('http');

// GameBoard_UploadCDN

// GameBoard
router.get('/GameBoard', function(req, res) {
	common.log(req.session['account'], 'call GameBoard');
	common.CreateHtml("GameBoard", req, res);
});
// GameBoard_List
router.post('/GameBoard_List', function (req, res) {
	common.BackendConnection(function (err, connection) {
		if (err) throw err;

		var sql = "SELECT * FROM `GameBoard` WHERE `Del` = 'N'";
		common.log(req.session['account'], sql);
		var query = connection.query(sql, [req.body.type], function (error, dbresults, fields) {
			if (err) {
				res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
			} else {
				res.send({ data: dbresults, type: req.body.type});
			}
			connection.release();
			res.end();
		});
		common.log(req.session['account'], query.sql);
	});
});


// GameBoard_Add
router.post('/GameBoard_Add', function (req, res) {
	// common.CreateHtml("GameBoardTransfer", req, res, function(err) {
		common.BackendConnection(function (err, connection) {
			var sql = "INSERT INTO `GameBoard` SET ?, `modifyTime` = NOW()"; // 上傳後要更新的資料表
			var insertData = {
				contentURL: req.body.contentURL.trim(),
				isTop: req.body.isTop,
				publishDate: req.body.publishDate,
				title: req.body.title.trim(),
				Content: req.body.Content,
				image: req.body.image.trim(),
				type: req.body.type
			};
			sql = connection.format(sql, insertData);
			common.log(req.session['account'], sql);

			connection.query(sql, function(err, result) {
				if (err) {
					res.send({ code: "-1", result: err });
				} else {
					res.send({ code: "0" });
				}
				connection.release();
				res.end();
			});
		});
	// });
});

// GameBoard_Modify
router.post('/GameBoard_Modify', function (req, res) {
	common.CreateHtml("GameBoardTransfer", req, res, function(err) {
		common.BackendConnection(function (err, connection) {
			var updateData = {
				contentURL: req.body.contentURL.trim(),
				isTop: req.body.isTop,
				publishDate: req.body.publishDate,
				title: req.body.title.trim(),
				Content: req.body.Content,
				image: req.body.image.trim(),
				type: req.body.type
			};
			var sql = connection.format("UPDATE `GameBoard` SET ? WHERE `Id` = ?", [updateData, req.body.Id]);
			common.log(req.session['account'], sql);

			connection.query(sql, function(err, result) {
				if (err) {
					res.send({ code: "-1", result: err });
				} else {
					res.send({ code: "0" });
				}
				connection.release();
				res.end();
			});
		});
	});
});

// GameBoard_Del
router.post('/GameBoard_Del', function (req, res) {
	common.CreateHtml("GameBoardTransfer", req, res, function(err) {
		common.BackendConnection(function (err, connection) {
			if (err) throw err;
			var sql = connection.format("UPDATE `GameBoard` SET `Del` = 'Y' WHERE `Id` = ?", [req.body.Id]);
			common.log(req.session['account'], sql);

			connection.query(sql, function(err, result) {
				if (err) {
					res.send({ code: "-1", result: err });
				} else {
					res.send({ code: "0" });
				}
				connection.release();
				res.end();
			});
		});
	});
});



module.exports = router;