var express = require('express');
var router = express.Router();
var http = require('http');

var folderArr = {
	"WebAD": {
		"ground1": "ground1/Web/WebAD/",
		"ground2": "ground2/Web/WebAD/",
		"qa": "qa/Web/WebAD/",
		"qa2": "qa2/Web/WebAD/",
		"prod": "production/Web/WebAD/"
	},
	"PushNotify": {
		"ground1": "PushNotify/",
		"ground2": "PushNotify/",
		"qa": "PushNotify/",
		"qa2": "PushNotify/",
		"prod": "PushNotify/"
	},
	"WebSiteImage": {
		"ground1": "WebSiteImage/",
		"ground2": "WebSiteImage/",
		"qa": "WebSiteImage/",
		"qa2": "WebSiteImage/",
		"prod": "WebSiteImage/"
	},
	"ADWindow": {
		"ground1": "ground1/Game/ADWindow/",
		"ground2": "ground2/Game/ADWindow/",
		"qa": "qa/Game/ADWindow/",
		"qa2": "qa2/Game/ADWindow/",
		"prod": "production/Game/ADWindow/"
	},
	"ADLambox": {
		"ground1": "ground1/Game/ADLambox/",
		"ground2": "ground2/Game/ADLambox/",
		"qa": "qa/Game/ADLambox/",
		"qa2": "qa2/Game/ADLambox/",
		"prod": "production/Game/ADLambox/"
	},
	"BulletinKanban": {
		"ground1": "ground1/Game/BulletinKanban/",
		"ground2": "ground2/Game/BulletinKanban/",
		"qa": "qa/Game/BulletinKanban/",
		"qa2": "qa2/Game/BulletinKanban/",
		"prod": "production/Game/BulletinKanban/"
	},
};

function fileUploader(req, callback) {
	var environment = "";
	var folderIndex = req.body.type;
	if(process.env.environment == null){
		environment = "ground1";
	} else {
		environment = process.env.environment;
	}
	if(folderIndex == null || folderArr[folderIndex] == null){
		callback(400, 'ERROR! folderIndex is null', 'null', 'null');
	}
	if(folderArr[folderIndex][environment] == null){
		callback(400, 'ERROR! folderIndex is null', 'null', 'null');
	}

	if (!req.files) {
		callback(400, 'No files were uploaded', 'null', 'null');
		return;
	}
	var fileArr = req.files.uploadImage;
	if (!fileArr) {
		callback(400, 'No files were uploaded', 'null', 'null');
		return;
	}

	var boundaryKey = req.headers['content-type'].replace("multipart/form-data; ", "");

	var payload = '--' + boundaryKey + '\r\n'
	+ 'Content-Type: '+fileArr.mimetype+'\r\n' 
	+ 'Content-Disposition: form-data; name="uploadfile"; filename="' + fileArr.name + '"\r\n'
	+ 'Content-Transfer-Encoding: binary\r\n\r\n';
	var enddata  = '\r\n--' + boundaryKey + '--';
	var totalSize = Buffer.byteLength(payload) + Buffer.byteLength(enddata) + Buffer.byteLength(fileArr.data);

	var options = {
		"method": "POST",
		"hostname": global.StorageService.host,
		"port": global.StorageService.port,
		"path": "/uploadCDN",
		"headers": {
			"Content-Type": 'multipart/form-data; boundary="'+boundaryKey+'"',
			"Content-Length": totalSize,
			"service": "Backend",
			"folder": folderArr[folderIndex][environment],
			"filename": "[random/none]",
		}
	};

	var jsonData = {};
	var cdnReq = http.request(options, function (res) {
		var chunks = [];
		res.on('data', function(body) {
			jsonData = JSON.parse(body)
			// console.log("body:" + jsonData.FileName);
		});
		res.on("end", function () {
			// var body = Buffer.concat(chunks);
			// console.log(body.toString());
			callback(200, null, jsonData.FileName, fileArr.name);
		});
	});
	cdnReq.on('error', function(e) {
		callback(400, e, jsonData.FileName, fileArr.name);
	});

	cdnReq.write(payload, 'utf-8');
	cdnReq.write(fileArr.data, 'binary');
	cdnReq.write(enddata, 'utf-8');
	cdnReq.end();
}

function deleteImageFileFromDB(table, key, colName, where, folder, callback) {
	common.BackendConnection(function (err, connection) {
		if (err) throw err;
		var sql = "SELECT * FROM `" + table + "` WHERE `" + key + "` = ?";
		var query = connection.query(sql, [where], function (error, result, fields) {
			if (err) throw err;
			var FileName = result[0][colName];
			connection.release();
			callback();
		});
	});
}
// cdnUpload({
// 		"200001": "火牛",
// 		"200002": "忍者",
// 		"200003": "福娃",
// 		"200004": "江山",
// 		"200005": "后羿",
// 		"200006": "熊貓",
// 		"200007": "齊天",
// 		"200008": "變臉",
// 		"200009": "駱馬大冒險",
// 		"200010": "過新年 ",
// 		"200011": "博物館大冒險",
// 		"200012": "金雞報囍",
// 		"200013": "麻雀無雙",
// 		"200014": "悟空",
// 		"200015": "黄金香蕉帝國",
// 		"200016": "拿破崙",
// 		"200017": "台灣黑熊",
// 		"200018": "芝麻開門",
// 		"200019": "文房四寶",
// 		"200020": "亞瑟王",
// 		"200021": "唐伯虎",
// 		"200022": "骰寶無雙",
// 		"200023": "關公",
// 		"200024": "印加帝國",
// 		"200025": "五福臨門",
// 		"200026": "淘寶金庫",
// 		"200027": "九尾狐",
// 		"307001": "龍王捕魚",
// 		"307002": "龍王捕魚2"
// 	});


router.get('/PictureUploaderTool', function(req, res) {
	common.log(req.session['account'], 'call PictureUploaderTool');
	common.CreateHtml("PictureUploaderTool", req, res);
});

router.post('/GetPictures', function (req, res) {
	common.BackendConnection(function (err, connection) {
		if (err) throw err;
		var no_order = "";
		var pid_order = "";

		switch(req.body.order) {
			case "DESC":
				no_order = "DESC";
				pid_order = "ASC";
				break;
			case "ASC":
				no_order = "ASC";
				pid_order = "DESC";
				break;
			default:
				no_order = "ASC";
				pid_order = "DESC";
				break;
		}

		var sql = "SELECT * FROM `ReservationPicture` WHERE `Type` = ? AND `Del` = 'N' AND `onCDN` = 'Y' ORDER BY `no` " + no_order + ", `pid` " + pid_order;
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

router.post('/getLangList', function (req, res) {
	common.BackendConnection(function (err, connection) {
		if (err) throw err;
		var sql = "SELECT * FROM `LanguageList` WHERE 1";
		var query = connection.query(sql, function (error, dbresults, fields) {
			if (err) {
				res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
			} else {
				res.send({ data: dbresults });
			}
			connection.release();
			res.end();
		});
		common.log(req.session['account'], query.sql);
	});
});

router.post('/SendPicture', function (req, res) {
	fileUploader(req, function (httpStstus, errDetail, afterName, beforeName, MimeType, Folder) {
		if(httpStstus == 200){
			common.BackendConnection(function (err, connection) {
				var sql = "INSERT INTO `backend`.`ReservationPicture` (`Type`, `Picture`, `onCDN`) VALUES (?)"; // 上傳後要更新的資料表
				var insertData = [ req.body.type, afterName, 'Y' ];
				sql = connection.format(sql, [insertData]);
				common.log(req.session['account'], sql);
				connection.query(sql, function (err, result) {
					res.status(httpStstus).send(errDetail).end();
					connection.release();
				});
			});
		} else {
			res.status(httpStstus).send(errDetail).end();
		}
		common.log(req.session['account'], '[FileUpload] ' + '[uploadHTTPCode]:' + httpStstus + ', [errDetail]:' + errDetail + ', [afterName]:' + afterName + ', [beforeName]:' + beforeName + ', [MimeType]:' + MimeType + ', [Folder]:' + req.body.type);
		
	});
});

router.post('/DelPicture', function (req, res) {
	common.BackendConnection(function (err, connection) {
		if (err) throw err;
		var sql = "UPDATE `ReservationPicture` SET `Del` = 'Y' WHERE `ReservationPicture`.`pid` = ?";
		var query = connection.query(sql, [req.body.pid], function (error, dbresults, fields) {
			if (err) {
				res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
			} else {
				res.send({ data: dbresults });
			}
			connection.release();
			res.end();
		});
		common.log(req.session['account'], query.sql);
	});
});

router.post('/EditPicture', function (req, res) {
	common.BackendConnection(function (err, connection) {
		if (err) throw err;
		var sql = "UPDATE `ReservationPicture` SET `Lang` = ?, `Annotation` = ? WHERE `ReservationPicture`.`pid` = ?";
		var query = connection.query(sql, [req.body.lang, req.body.annotation, req.body.pid], function (error, dbresults, fields) {
			if (err) {
				res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
			} else {
				res.send({ data: dbresults });
			}
			connection.release();
			res.end();
		});
		common.log(req.session['account'], query.sql);
	});
});

router.post('/OrderPicture', function (req, res) {
	var sql = "";
	var updateData = [];
	req.body.data.forEach(function (value, key, arr) {
		sql += "UPDATE `ReservationPicture` SET `no` = ? WHERE `pid` = ?;";
		updateData.push(value.no.toString(), value.pid.toString());
	});

	common.BackendConnection(function (err, connection) {
		if (err) throw err;
		var query = connection.query(sql, updateData, function (error, dbresults, fields) {
			if (err) {
				res.send({ code: "-1", msg: "連線失敗", sql: sql, result: err });
			} else {
				res.send('ok').end();
			}
			connection.release();
			res.end();
		});
		common.log(req.session['account'], query.sql);
	});
});

router.get('/GetCDNDomain', function (req, res) {
	res.send(global.cdnurl).end();
});

router.get('/GetCDNDomainWithENV', function (req, res) {
	var environment = "";
	var folderIndex = req.query.type;
	if(process.env.environment == null){
		environment = "ground1";
	} else {
		environment = process.env.environment;
	}
	if(folderIndex == null || folderArr[folderIndex] == null){
		var txt = "ERROR! folderIndex is null"
		common.log(req.session['account'], txt);
		console.error(txt);
		res.status(400).send(txt);
	}
	if(folderArr[folderIndex][environment] == null){
		var txt = "ERROR! folderIndex is null"
		common.log(req.session['account'], txt);
		console.error(txt);
		res.status(400).send(txt);
	}
	res.send(global.cdnurl + folderArr[folderIndex][environment]).end();
});


module.exports = router;