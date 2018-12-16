var express = require('express');
var router = express.Router();
var http = require('http');
var async = require("async");
var request = require("request");

var staticDataList = [
    {
        type: 'sql',
        arrName: 'GameDataRequest',
        arrList: [
            {
                arrName: 'gameInfoList',
                sql: `
                    SELECT
                        a.GameId as gameId,
                        a.SCGGameId as scgGameId,
                        a.GameName as gameName,
                        c.GameStateName as gameStateName,
                        d.GameTypeName as gameTypeName,
                        a.GameContent as gameContent,
                        a.GameServerIp as gameServerIp,
                        a.GameServerPort as gameServerPort,
                        a.GameUnlockLevelId as gameUnlockLevelId,
                        a.BetType as betType,
                        a.BaseCredit as baseCredit,
                        JSON_OBJECT(
                            "id", b.Id,
                            "gameId", b.GameId,
                            "gameSettings", b.GameSettings,
                            "active", b.Active
                        ) as gameSettingInfo,
                        e.betLevelInfoList as betLevelInfoList
                    FROM Games as a
                    JOIN GameSetting as b
                        ON a.GameId = b.Id
                    JOIN GameState as c
                        ON a.GameStateId = c.GameStateId
                    JOIN GameType as d
                        ON a.GameTypeId = d.GameTypeId
                    JOIN (
                        SELECT
                        BetType,
                        CAST(
                            CONCAT(
                                "[",
                                GROUP_CONCAT(
                                    JSON_OBJECT(
                                        "id", id,
                                        "betLevel", BetLevel,
                                        "betCoin", BetCoin
                                    )
                                ),
                                "]"
                            ) AS JSON
                        ) AS betLevelInfoList
                        FROM BetLevelCoin
                        group by BetType
                    ) as e
                        ON a.BetType = e.BetType
                    WHERE a.GameStateId IN(1, 3, 4)
                    ORDER BY a.Sort, a.gameUnlockLevelId
                    `
            },
            {
                arrName: 'hallInfoList',
                sql: `
                    SELECT
                        a.Id as id,
                        a.HallName as hallName,
                        a.Sort as sort,
                        a.VIPCondition as vipCondition,
                        a.LevelCondition as levelCondition,
                        a.Denom as denom,
                        b.betLevelInfoList as betLevelInfoList
                    FROM JCGGame.HallData as a
                    JOIN (
                        SELECT
                            HallDataId,
                            CAST(
                                CONCAT(
                                    "[",
                                    GROUP_CONCAT(
                                        JSON_OBJECT(
                                            "id", Id,
                                            "betLevel", BetLevelId
                                        )
                                    ),
                                    "]"
                                ) AS JSON
                            ) AS betLevelInfoList
                        FROM HallData2BetLevel
                        GROUP BY HallDataId
                    ) as b
                    ON a.id = b.HallDataId;
                `
            }
        ]
    },
    // {
    //     type: 'rest',
    //     arrName: 'GameDataRequest',
    //     service: '/GameService/GameDataRequest',
    //     body: { "action": "GetByAll" }
    // },
    {
        type: 'rest',
        arrName: 'ChipDataRequest',
        service: '/ChipService/ChipDataRequest',
        body: { "action": "GetAllChip" }
    },
    {
        type: 'rest',
        arrName: 'ADBannerResponse',
        service: '/ADBannerService/GetADBanner',
        body: { "lang": "tch" }
    },
    {
        type: 'rest',
        arrName: 'ItemDataRequest',
        service: '/ItemService/ItemDataRequest',
        body: { "action": "GetAll" }
    },
    {
        type: 'rest',
        arrName: 'TemplateDataResponse',
        service: '/ParamService/TemplateDataRequest',
        body: { "action": "GetTemplateByAll" }
    },
    {
        type: 'rest',
        arrName: 'CustomerServiceList',
        service: '/MemberService/CustomerServiceListRequest',
        body: {}
    },
    {
        type: 'rest',
        arrName: 'LevelDataRequest',
        service: '/MemberService/LevelDataRequest',
        body: {}
    },
    {
        type: 'rest',
        arrName: 'ParamsResult',
        service: '/ParamService/GetParam',
        body: {}
    },
];

var refreshGameDataList = [
    {
        type: 'sql',
        arrName: 'GameDataRequest',
        arrList: [
            {
                arrName: 'gameInfoList',
                sql: `
                    SELECT
                        a.GameId as gameId,
                        a.SCGGameId as scgGameId,
                        a.GameName as gameName,
                        c.GameStateName as gameStateName,
                        d.GameTypeName as gameTypeName,
                        a.GameContent as gameContent,
                        a.GameServerIp as gameServerIp,
                        a.GameServerPort as gameServerPort,
                        a.GameUnlockLevelId as gameUnlockLevelId,
                        a.BetType as betType,
                        a.BaseCredit as baseCredit,
                        JSON_OBJECT(
                            "id", b.Id,
                            "gameId", b.GameId,
                            "gameSettings", b.GameSettings,
                            "active", b.Active
                        ) as gameSettingInfo,
                        e.betLevelInfoList as betLevelInfoList
                    FROM Games as a
                    JOIN GameSetting as b
                        ON a.GameId = b.Id
                    JOIN GameState as c
                        ON a.GameStateId = c.GameStateId
                    JOIN GameType as d
                        ON a.GameTypeId = d.GameTypeId
                    JOIN (
                        SELECT
                        BetType,
                        CAST(
                            CONCAT(
                                "[",
                                GROUP_CONCAT(
                                    JSON_OBJECT(
                                        "id", id,
                                        "betLevel", BetLevel,
                                        "betCoin", BetCoin
                                    )
                                ),
                                "]"
                            ) AS JSON
                        ) AS betLevelInfoList
                        FROM BetLevelCoin
                        group by BetType
                    ) as e
                        ON a.BetType = e.BetType
                    WHERE a.GameStateId IN(1, 3, 4)
                    ORDER BY a.Sort, a.gameUnlockLevelId
                    `
            },
            {
                arrName: 'hallInfoList',
                sql: `
                    SELECT
                        a.Id as id,
                        a.HallName as hallName,
                        a.Sort as sort,
                        a.VIPCondition as vipCondition,
                        a.LevelCondition as levelCondition,
                        a.Denom as denom,
                        b.betLevelInfoList as betLevelInfoList
                    FROM JCGGame.HallData as a
                    JOIN (
                        SELECT
                            HallDataId,
                            CAST(
                                CONCAT(
                                    "[",
                                    GROUP_CONCAT(
                                        JSON_OBJECT(
                                            "id", Id,
                                            "betLevel", BetLevelId
                                        )
                                    ),
                                    "]"
                                ) AS JSON
                            ) AS betLevelInfoList
                        FROM HallData2BetLevel
                        GROUP BY HallDataId
                    ) as b
                    ON a.id = b.HallDataId;
                `
            }
        ]
    }
];

function getCommonData(service, body, callback) {
    common.CommonURL(function (commonURL) {
        var options = {
            method: 'POST',
            url: commonURL+service,
            headers: { 'content-type': 'application/json' },
            body: body,
            json: true
        };

        request(options, function (err, response, body) {
            if (err) {
                common.log("system", "getCommon: " + JSON.stringify(err));
            }
            callback(body, err);
        });

    });
}
function sqlCommonData(sql, callback) {
    common.SCGConnection(function (err, connection) {
        connection.query(sql, function (err, result) {
            if (err) {
                common.log("system", "sqlCommon: " + JSON.stringify(err));
            }
            var allData = [];
            result.forEach(function (value, key) {
                var parserKey = Object.keys(value);
                var subData = {};
                parserKey.forEach(function (sval, skey) {
                    var str = String(value[sval]);
                    if (str.indexOf('{') !== -1) {
                        subData[sval] = JSON.parse(value[sval]);
                    } else {
                        subData[sval] = value[sval];
                    }
                });
                allData.push(subData);
            });
            connection.release();
            callback(allData, err);
        });
    });
}
function transferData2CDN(arrList, path, filename, callback) {
    var dataArr = new Object();
    async.forEachOf(arrList, function (value, key, Async_cb) {
        if (value.type === 'rest') {
            getCommonData(value.service, value.body, function (res, err) {
                dataArr[value.arrName] = res;
                Async_cb(err);
            });
        } else {
            dataArr[value.arrName] = {};
            async.forEachOf(value.arrList, function (s_val, s_key, s_cb) {
                sqlCommonData(s_val.sql, function (res, err) {
                    dataArr[value.arrName][s_val.arrName] = res;
                    s_cb(err);
                });
            }, function (err) {
                if (err) {
                    common.log("system", err);
                } else {
                    Async_cb(err);
                }
            });
        }
    }, function (err) {
        if (err) {
            common.log("system", err);
        } else {
            cdnUpload(dataArr, path, filename, function (httpcode, msg) {
                common.log("system", `transferData2CDN - httpcde: ${httpcode}, ${JSON.stringify(msg)}`);
            })
        }
        callback(err);
    });
}

router.post('/refreshStaticData', function (req, res) {
    common.CreateHtml("refreshStaticData", req, res, function (err) {
        var AsyncList = [
            function (callback) {
                transferData2CDN(staticDataList, 'StaticData', 'StaticData.json', function (err) {
                    callback(err);
                });
            },
            function (callback) {
                transferData2CDN(refreshGameDataList, 'StaticData', 'RefreshGameData.json', function (err) {
                    callback(err);
                });
            }
        ];
        async.series(AsyncList, function (err, result) {
            if (err) {
                common.log(req.session['account'], err);
                res.send({ code: "-1", error: err }).end();
            } else {
                res.send({ code: "0" }).end();
            }
        });
    });
});



module.exports = router;