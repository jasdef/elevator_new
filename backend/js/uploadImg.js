var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');                     
var formidable = require('formidable');    
var dateFormat = require('dateformat');     

router.get('/PhotoView', function(req, res) {
    common.log(req.session['account'], 'call PhotoView');
    common.CreateHtml("PhotoView", req, res);
});

router.post('/UploadImg', function (req, res) {
    common.CreateHtml("UploadImg_Transfer", req, res, function (err) {
        common.log(req.session['account'], "call upload img");
       
        if (err) {
            common.log(req.session['account'], err);
            throw err;
        }

        var dirName = "img";            
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname,'../upload',"img");
        
        form.keepExtensions = true;
        form.encoding = 'utf-8';
        
        form.parse(req, function(err, fields, files) {
            if(err) {
                common.log(req.session['account'], err);
                return;
            }

            if(!files.userfile){
                var errMsg = {
                    errCode : -10,
                    errMsg : '檔案是空的'
                };
                common.log(req.session['account'], errMsg);
                return;
            }

            var time = dateFormat(new Date(), "yyyymmddHHMMss");
            var extName = path.extname(files.userfile.path);    
            var newName = time + '_' + Math.floor(Math.random()*9999) + extName;
            
            var oldPath = files.userfile.path;
            var newPath = path.join(__dirname,'../upload',dirName, newName);
            fs.renameSync(oldPath,newPath);
            var finalPath = path.join('/',dirName,newName).split('\\').join('/');
            

            res.json({
                errCode : 1,
                errMsg : '上傳成功',
                fields :  fields,    
                fielPath : finalPath               
            });
            
            common.log(req.session['account'], "call upload img sucess");

            res.end();
        });               
    });
});


router.post('/InsertImgMapping', function (req, res) {
    common.CreateHtml("UploadImg_Transfer", req, res, function (err) {
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(res.session['account'], err);
                throw err;
            }
            var tableType = req.body.TableType;
            var tableId = req.body.TableId;
            var path = req.body.Path;
            var fileType = 1;


            var addSQL = "insert into `file_mapping` (`table_type`, `table_id`, `path`, `file_type`) VALUES (?,?,?,?);";

            var data = 
            [
                tableType, 
                tableId,
                path,
                fileType
            ];

            addSQL = connection.format(addSQL, data);   
            var sql = addSQL;

            common.log(req.session['account'], sql);

            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({error : err});
                }
                else {
                    res.send({ code: 0, msg: "新增成功!" });

                }
                connection.release();
                res.end();
            });

        });        
    });

});

router.post('/DeletePhoto', function (req, res) {
    common.CreateHtml("UploadImg_Transfer", req, res, function (err) {
        common.log(req.session['account'], "call DeletePhoto");
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(req.session['account'], err);
                throw err;
            }
              
            var id = req.body.Id;
                
            var dataSelect = "update file_mapping set `is_delete`=1 where `id` = "+id+";";
    
            var sql = dataSelect;
    
            common.log(req.session['account'], sql);
    
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], error);
                    res.send({ code: error, msg: "刪除失敗", err: error });
                } else {
                                       
                    res.send({ code: 0, msg: "刪除成功" });
                }
                connection.release();
                res.end();
            });
        });                            
    });
});

router.post('/GetPhotoList', function (req, res) {
    common.CreateHtml("UploadImg_Transfer", req, res, function (err) {
        common.log(req.session['account'], "call GetPhotoList");
        common.BackendConnection(res, function (err, connection) {
            if (err) {
                common.log(req.session['account'], err);
                throw err;
            }
    
            var type = req.body.Type;
            var tableId = req.body.Id;
                
            var dataSelect = "select * from file_mapping where table_id="+tableId+" and table_type="+type+" and is_delete=0;";
    
            var sql = dataSelect;
    
            common.log(req.session['account'], sql);
    
            connection.query(sql, function (error, result, fields) {
                if (error) {
                    common.log(req.session['account'], err);
                    res.send({error : err});
                }
                else {
            
                    res.send({ data: result });
                }
                connection.release();
                res.end();
            });
        });                            
    });
});



module.exports = router;