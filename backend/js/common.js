var mysql = require('mysql');
var fs = require('fs');
var path = require("path");
var async = require("async");
var nodemailer = require('nodemailer');

var AuthLv = {
    "all": 1,
    "user": 9,
    "admin": 10,
    "developer": 999
}

function ConnectBackendDB() {
    var obj = {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: 'elevator',
        multipleStatements: true // 有坑，若要於單次connection執行一個以上的query就需要設為true
    };
    switch (process.env.environment) {
        case "ground1":
            obj.host = '127.0.0.1';
            break;
        case "ground2":
            obj.host = '104.199.176.184';
            break;
        case "dev":
            obj.host = '127.0.0.1';
            break;
    }
    return obj;
}

var BackendPool = mysql.createPool(ConnectBackendDB());
var AuthInfo;
var MenuInfo;
function common() {
    fs.readFile(path.join(__dirname + './../config/htmlAuth.json'), 'utf8', function (err, data) {
        if (err) {
            this.log("system", err);
            throw err;
        }
        AuthInfo = JSON.parse(data);
    });
    fs.readFile(path.join(__dirname + './../config/htmlmenu.json'), 'utf8', function (err, data) {
        if (err) {
            this.log("system", err);
            throw err;
        }
        MenuInfo = JSON.parse(data);
    });
}

common.prototype.BackendConnection = function (res, callback) {
    if (typeof callback === 'undefined' && typeof res !== 'undefined') {
        callback = res;
        BackendPool.getConnection(function (err, connection) {
            if (err) {
                common.prototype.log("system", err);
                connection.release();
                return;
            }
            callback(err, connection);
        });
    }
    else {
        BackendPool.getConnection(function (err, connection) {
            if (err) {
                res.send({ code: "-1", msg: "DB連線失敗" });
                res.end();
                connection.release();
                return;
            }
            callback(err, connection);
        });
    }
};

common.prototype.ChargeURL = function (callback) {
    var url = 'http://qamodule_account.jumbo-slots.com';
    switch (process.env.environment) {
        case "ground1":
            url = 'http://qamodule_account.jumbo-slots.com';
            break;
        case "ground2":
            url = 'http://qamodule_account.jumbo-slots.com';
            break;
        case "dev":
            break;
        case "qa":
            break;
        case "qa2":
            break;
        case "prod":
            url = 'http://module_account.jumbo-slots.com';
            break;
    }
    callback(url);
};



common.prototype.ReplaceCommonHtml = function (filepath, req, callback) {
    fs.readFile(path.join(__dirname + './../public/common.html'), 'utf8', function (commonerr, commondata) {
        if (commonerr) throw commonerr;
        fs.readFile(filepath, 'utf8', function (err, data) {
            if (err) throw err;
            ReplaceTagHtmlData(commondata, '<!--Menu&Top-->', data, function (data) {
                ReplaceTagHtmlData(commondata, '<!--footer-->', data, function (data) {
                    ReplaceVersion('<!--version-->', data, function (data) {
                        callback(data.replace('<!--name-->', req.session['account']));
                    });
                });
            });
        });
    });
};

function pad(v) {
    return (v < 10) ? '0' + v : v
}

function getDateString(d) {
    var result = [];
    var year = d.getFullYear();
    var month = pad(d.getMonth() + 1);
    var day = pad(d.getDate());
    var hour = pad(d.getHours());
    var min = pad(d.getMinutes());
    var sec = pad(d.getSeconds());
    result.push(year + month + day);
    result.push(hour + ":" + min + ":" + sec);
    return result;
}

common.prototype.log = function (account, operateContent) {
    var date = getDateString(new Date()); 
    var log = JSON.stringify({ "Time ": date[1], "User": account, "Data": operateContent });
    var isThrowError = false;
    var errorMsg = "the account is null or empty!";
    var filename = date[0] + '.txt';

    fs.appendFile(path.join(__dirname + './../' + filename), log + '\r\n', (err) => {
        if (err) throw err;
    });
    console.log(log);

    BackendPool.getConnection(function (err, connection) {
            
            if (err) {
                common.prototype.log("system", err);
                connection.release();
                return;
            }

            if (account === null || account === "") {   
                account = "system";//System   
                operateContent =  errorMsg +" "+operateContent;       
                isThrowError =  true;                
            }

            var sql = connection.format("Insert into behavior_log (account_id, operator) select id, ? from account where account = ?", [JSON.stringify(operateContent), account]);
            connection.query(sql, function(err, dbresults, fields){
                if (err) {
                    throw err;                
                }
                connection.release();
            });

            if (isThrowError)
                throw errorMsg;
    });

};

common.prototype.CreateHtml = function (key, req, res, cb) {
    async.waterfall([
        function (callback) {
            if (typeof (req.session['account']) === "undefined") {
                res.redirect('/LoginForm');
                return;
            }
            else {
                callback();
            }
        }, function (callback) {
            if ((typeof (AuthInfo[key]) === 'undefined') || (AuthInfo[key].enable == false)) {
                res.status(404).send("404");
                res.end();
                common.prototype.log("system", "404");
                return;
            }
            else {
                callback(null);
            }
        }, function (callback) {
            if (AuthLv[req.session['autho']] < AuthLv[AuthInfo[key].autho]) {
                res.status(403).send("403");
                res.end();
                common.prototype.log("system", "403");
                return;
            }
            else {
                callback(null);
            }
        }, function (callback) {
            if (AuthInfo[key].type === "protocol") {
                cb();
                return;
            }
            else if (AuthInfo[key].type === "view") {
                ReadHtml(path.join(__dirname + AuthInfo[key].htmlpath), function (data) {
                    callback(null, data);
                })
            }
        }, function (data, callback) {
            ReplaceTopbox(data, function (data) {
                callback(null, data.replace('<!--name-->', req.session['account']));
            })
        }, function (data, callback) {
            ReplaceFooter(data, function (data) {
                callback(null, data);
            })
        }, function (data, callback) {
            ReplaceMenu(data, function (data) {
                callback(null, data);
            })
        }, function (data, callback) {
            FreshMenu(data, req.session['autho'], function (data) {
                callback(null, data);
            })
        }
    ], function (err, result) {
        res.send(result);
        res.end();
    });
};

function ReadHtml(filepath, callback) {
    fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) throw err;
        callback(data);
    });
}

function ReplaceTopbox(data, callback) {
    fs.readFile(path.join(__dirname + './../public/common.html'), 'utf8', function (err, commondata) {
        if (err) throw err;
        ReplaceTagHtmlData(commondata, '<!--Top-->', data, function (data) {
            callback(data);
        });
    });
}

function ReplaceFooter(data, callback) {
    fs.readFile(path.join(__dirname + './../public/common.html'), 'utf8', function (err, commondata) {
        if (err) throw err;
        ReplaceTagHtmlData(commondata, '<!--footer-->', data, function (data) {
            ReplaceVersion('<!--version-->', data, function (data) {
                callback(data);
            });
        });
    });
}

function ReplaceMenu(data, callback) {
    fs.readFile(path.join(__dirname + './../public/menu.html'), 'utf8', function (err, menudata) {
        if (err) throw err;
        ReplaceTagHtmlData(menudata, '<!--Menu-->', data, function (data) {
            callback(data);
        });
    });
}


function FreshMenu(data, autho, cb) {
    var text = "";
    async.forEachOf(MenuInfo, function (value, parent, callback1) {
        if (AuthLv[autho] < AuthLv[MenuInfo[parent].autho]) {
            callback1();
        }
        else {
            if (value.enable) {
                text = text + "<li><a><i class='fa fa-users'></i>";
                text = text + parent + "<span class='fa fa-chevron-down'></span></a>\r\n";
                text = text + "<ul class='nav child_menu'>\r\n";
                async.forEachOf(MenuInfo[parent].child, function (value, child, callback2) {
                    if (value.enable) {
                        text = text + "<li><a href='" + value.href + "'>" + child + "</a></li>\r\n";
                    }
                    callback2();
                }, function (err) {
                    text = text + "</ul>\r\n";
                    text = text + "</li>\r\n";
                    callback1();
                })
            }
            else { callback1() };
        }
    }, function (err) {
        cb(data.replace('<!--LeftMenu-->', text));
    });
}


function ReplaceTagHtmlData(commondata, tag, data, callback) {
    var startposition = commondata.indexOf(tag);
    var endposition = commondata.indexOf(tag, startposition + tag.length);
    callback(data.replace(tag, commondata.substring(startposition, endposition)));
}

function ReplaceVersion(tag, data, callback) {
    fs.readFile(__dirname + '/../package.json', 'utf8', function (err, d) {
        if (err) throw err;
        obj = JSON.parse(d);
        callback(data.replace(tag, obj.version));
    });
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, 
    auth: {
        user: 'jumbogames.net@gmail.com',
        pass: 'jumbo.net'
    },
    tls: {
        rejectUnauthorized: false
    }
});

common.prototype.SendMail = function (user, message) {
    var mailOptions = {
        from: 'jumbogames.net@gmail.com',
        to: user,
        subject: 'Backend Error',
        text: message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

common.prototype.CommonURL = function (callback) {
    var url = 'http://192.168.123.118:8080';
    switch (process.env.environment) {
        case "ground1":
            url = 'http://192.168.123.118:8080';
            break;
        case "ground2":
            url = '';
            break;
        case "qa":
            url = "http://10.140.0.5:8080";
            break;
        case "qa2":
           url = "http://10.140.0.4:8080";
            break;
        case "prod":
            url = "http://10.140.0.29:8080";
            break;
    }
    callback(url);
};

common.prototype.BannedUser = function (MemberId, date) {
    s.BannedUser(MemberId, parseInt(date.getTime()));
}


common.prototype.GetSmartfoxChannelList = function () {
    return s.GetRoomList();
}

common.prototype.SendMessage = function (room, message) {
    s.SendMessage(room,message);
}
common.prototype.delayTimeSetting = function () {
    switch (process.env.environment) {
        case "ground1":
            return 1;
        case "ground2":
            return 1;
        case "dev":
            return 1;
        case "qa":
            return 1;
        case "qa2":
            return 1;
        case "prod":
            return 10;
    }
}

module.exports = new common;