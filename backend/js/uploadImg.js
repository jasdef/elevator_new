var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');                     
var formidable = require('formidable');    
var dateFormat = require('dateformat');     

router.post('/UploadImg', function (req, res) {
    common.CreateHtml("UploadImg_Transfer", req, res, function (err) {
        common.log(req.session['account'], "call upload img");

        common.BackendConnection(res, function (err, connection) {
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
                });
                
                common.log(req.session['account'], "call upload img sucess");

                res.end();
            }); 
            

            // var dataSelect = "select * from transaction_form;";
            // var countSelect = "select COUNT(*) as count from transaction_form;";

   
            // var sql = countSelect + dataSelect;

            // common.log(req.session['account'], sql);

            // connection.query(sql, function (error, result, fields) {
            //     if (error) {
            //         common.log(req.session['account'], err);
            //         res.send({error : err});
            //     }
            //     else {
            //         var totallength = result[0][0].count;
            //         res.send({ recordsTotal: totallength, recordsFiltered: totallength, data: result[1] });
            //     }
            //     connection.release();
            //     res.end();
            // });

        });        
    });

});





module.exports = router;