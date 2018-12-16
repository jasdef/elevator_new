var express = require('express');
var path = require("path");
var router = express.Router();
var async = require("async");
router.get('/ManualTarget', function (req, res) {
    common.log(req.session['account'], 'call ManualTarget');
    common.CreateHtml("ManualTarget", req, res);
});

router.post('/ManualTargetGetImportMember', function (req, res) {
    common.CreateHtml("ManualTargetGetImportMember", req, res, function () {
        common.SCGConnection(res, function (err, connection) {
            var Members = JSON.parse(req.body.Members);
            var str = "SELECT * FROM JCGGame.backendMemberInfo WHERE MemberId IN (";

            console.log(Members);
            if (Members.length > 0) {
                for(var i = 0; i < Members.length; i++){
                    if (i == Members.length - 1) {
                        str += connection.escape(Members[i].MemberId) + ")";
                    } else {
                        str += connection.escape(Members[i].MemberId) + ", ";
                    }
                }
            } else {
                res.send({ data: [] });
                res.end();
            }
            console.log("str : " + str);
            common.log(req.session['account'], str);
            connection.query(str, function (error, dbresults, fields) {
                connection.release();
                if (error) throw error;
                res.send({ data: dbresults });
                res.end();
            });
        });
    });
});

router.post('/ManualTargetSearch', function (req, res) {
    common.CreateHtml("ManualTargetSearch", req, res, function () {
        common.SCGConnection(res, function (err, connection) {
            var str = "SELECT * FROM JCGGame.backendMemberInfo";

            if (req.body.GroupM != null) {
                str = str + " a LEFT JOIN JCGGame.MemberAudience b ON a.MemberId = b.MemberId where";
            } else {
                str = str + " where";
            }

            var f = false;
            if (req.body.MemberId != null) {
                f = true;
                if (req.body.GroupM != null) {
                    str = str + " a.MemberId like " + connection.escape("%" + req.body.MemberId + "%");
                }
                else {
                    str = str + " MemberId like " + connection.escape("%" + req.body.MemberId + "%");
                }
            }
            if (req.body.MemberIdNumber != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " IdNumber like " + connection.escape("%" + req.body.MemberIdNumber + "%");
            }
            if (req.body.MemberNickName != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " NickName like " + connection.escape("%" + req.body.MemberNickName + "%");
            }
            if (req.body.MemberVIPLV != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " MemberVIP";
                str = str + EquValue(req.body.MemberVIPLV_filter);
                str = str + connection.escape(req.body.MemberVIPLV);
            }
            if (req.body.MemberAge != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " Age";
                str = str + EquValue(req.body.MemberAge_filter);
                str = str + connection.escape(req.body.MemberAge);
            }
            if (req.body.MemberLV != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " MemberLevel";
                str = str + EquValue(req.body.MemberLV_filter);
                str = str + connection.escape(req.body.MemberLV);
            }
            if (req.body.MemberCards != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " ItemCount";
                str = str + EquValue(req.body.MemberCards_filter);
                str = str + connection.escape(req.body.MemberCards);
            }
            if (req.body.MemberChips != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " ChipCount";
                str = str + EquValue(req.body.MemberChips_filter);
                str = str + connection.escape(req.body.MemberChips);
            }
            if (req.body.MemberActive != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " ActiveValue";
                str = str + EquValue(req.body.MemberActive_filter);
                str = str + connection.escape(req.body.MemberActive);
            }
            if (req.body.MemberFirstLogin != null) {
                if (f) {
                    str = str + " AND";
                }
                f = true;
                str = str + " FirstLogInTime";
                str = str + EquValue(req.body.MemberFirstLogin_filter);
                str = str + connection.escape(req.body.MemberFirstLogin);
            }
            if (req.body.MemberBalance != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;
                str = str + " MemberBalance";
                str = str + EquValue(req.body.MemberBalance_filter);
                str = str + connection.escape(req.body.MemberBalance);
            }
            if (req.body.MemberEmail != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;

                str = str + " Email like " + connection.escape("%" + req.body.MemberEmail + "%");
            }
            if (req.body.MemberName != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;

                str = str + " Name like " + connection.escape("%" + req.body.MemberName + "%");
            }
            if (req.body.MemberNation != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;

                str = str + " Nation like " + connection.escape(req.body.MemberNation);
            }
            if (req.body.MemberPhone != null) {
                if (f) {
                    str = str + " AND"
                }
                f = true;

                str = str + " CellPhoneNum like " + connection.escape("%" + req.body.MemberPhone + "%");
            }

            if (req.body.GroupM != null) {
                if (f) {
                    str = str + " AND";
                }
                f = true;
                str = str + " AudienceId = " + connection.escape(req.body.GroupM);;
            }

            if (req.body.MemberRegistered != null) {
                if (f) {
                    str = str + " AND";
                }
                f = true;
                str = str + " CreateTime";
                str = str + EquValue(req.body.MemberRegistered_filter);
                str = str + connection.escape(req.body.MemberRegistered);
            }

            if (req.body.MemberOffline != null) {
                if (f) {
                    str = str + " AND";
                }
                f = true;
                str = str + " OfflineDays";
                str = str + EquValue(req.body.MemberOffline_filter);
                str = str + connection.escape(req.body.MemberOffline);
            }


            common.log(req.session['account'], str);
            connection.query(str, function (error, dbresults, fields) {
                connection.release();
                if (error) throw error;
                res.send({ data: dbresults });
                res.end();
            });
        });
    });
});

router.post('/GetMemberGroupList', function (req, res) {
    common.CreateHtml("GetMemberGroupList", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var str = "SELECT * FROM JCGGame.Audience where Smart='0'";

            common.log(req.session['account'], str);
            connection.query(str, function (error, dbresults, fields) {
                connection.release();
                if (error) throw error;
                res.send({ data: dbresults });
                res.end();
            });
        });
    });
});

router.post('/InsertMemberToGroup', function (req, res) {
    common.CreateHtml("InsertMemberToGroup", req, res, function (err) {
        common.SCGConnection(res, function (err, connection) {
            var Members = JSON.parse(req.body.Members);
            if (Members.length == 0) {
                res.send({ code: "0", msg: "請選取會員" });
                res.end();
                connection.release();
                return;
            }
            var obj = { Done: "INSERT INTO MemberAudience Done ", Fail: "INSERT INTO MemberAudience Fail " };
            var index = 0;
            var max = Members.length;
            async.each(Members,function (Member, callback) {
                var str = "INSERT INTO JCGGame.MemberAudience (MemberId, AudienceId) VALUES ";
                str = str + "(" + connection.escape(Member) + "," + connection.escape(req.body.GroupId) + ");";
                connection.query(str, function (err, dbresults, fields) {
                    index++;
                    if (err) {
                        obj.Fail = obj.Fail + connection.escape(Member);
                    } else {
                        obj.Done = obj.Done + connection.escape(Member);
                    }
                    if (index == max) {
                        common.log(req.session['account'], obj.Fail);
                        common.log(req.session['account'], obj.Done);
                        res.send({ code: "0", msg: "修改成功" });
                        res.end();
                        connection.release();
                    }
                    callback();
                });
            });
        });
    });
});

function EquValue(data) {
    var str = " = ";
    switch (data) {
        case "0":
            str = " = ";
            break;
        case "1":
            str = " > ";
            break;
        case "2":
            str = " < ";
            break;
    }
    return str;
}

function EquValue2(data) {
    var str = " = ";
    switch (data) {
        case "0":
            str = " = ";
            break;
        case "1":
            str = " != ";
            break;
    }
    return str;
}

module.exports = router;