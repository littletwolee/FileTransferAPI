var express = require('express'),
    router = express.Router(),
    formidable = require('formidable'),
    Objects = require('../modules/Objects'),
    MongoHelper = require('../tools/mongohelper'),
    JsonHelper = require('../tools/JsonHelper'),
    Sendres = require('../tools/reshelper'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    range = require('../tools/Range'),
    collectionname = 'fs',
    mongohelper = new MongoHelper.MongoHelper('Files','127.0.0.1',27017);
    ;
/*Post Image*/
router.get('/FileUpload', function(req, res) {
    res.render('FileUpload', { title: 'Upload File' });
});
router.post('/UploadFile',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, files) {
        if(files.upload == undefined){
            res.write(JsonHelper.ObjectToJsonStr(new Objects.Result('err', 'File is empty!')));
            res.end();
            return;
        }
        fs.open(files.upload.path , 'r' , function (err,fd){
            if(err){
                console.error(err);
                return;
            }
            var buf = new Buffer(files.upload.size);
            fs.read(fd, buf, 0,files.upload.size, null, function(err,bytesRead, buffer){
                if(err){
                    console.log(err);
                    return;
                }
            })
            var file = new Objects.Files(
                null,
                files.upload.name,
                files.upload.type,
                files.upload.size
            );
            mongohelper.savefile(req, res, file,buf,function (err, result) {
                Sendres.sendres(res,err,result,'File saved error!',function(callbackcode){
                    if(callbackcode){
                        file.fileid =  result._id.toString();
                        mongohelper.savecollection(file, collectionname, function (err, result) {
                            Sendres.sendres(res,err,result,'File saved error!',function(callbackcode){
                                if(!callbackcode){
                                    mongohelper.deletefile(file.fileid,function(err,result){
                                        Sendres.sendres(res,err,result,'File saved error!',function(callbackcode){
                                            res.write(JsonHelper.ObjectToJsonStr(new Objects.Result('err', 'File saved error!')));
                                            res.end();
                                        },true)
                                    })
                                }else{
                                    res.write(JsonHelper.ObjectToJsonStr(new Objects.Result('success', result[0]._id.toString())));
                                    res.end();
                                }
                            },true)
                        })
                    }
                })
            },true)
        })
    });
})
/*Get Image*/
router.get('/DownloadFile',function(req,res){
    var arg = url.parse(req.url).query;
    var fileId =querystring.parse(arg).id;
    mongohelper.readcollection(fileId,collectionname,function(err,result){
        Sendres.sendres(res,err,result,'Id is not found!',function(callbackcode){
            if(callbackcode){
                mongohelper.readfile(result.fileid,function(err,buff){
                    Sendres.sendres(res,err,buff,'File is not found!',function(callbackcode){
                        if(callbackcode){
                            range.getrange(req,res,result,buff);
                        }
                    },true)
                },true)
            }
        })
    })
})
router.get('/deletefile',function(req,res){
    var arg = url.parse(req.url).query;
    var fileId =querystring.parse(arg).id;
    mongohelper.deletefile(fileId,function(err,result){
        if(err){
            log(err.message);
        }else{
            log(result);
        }
    })
    /*    mongohelper.readfile(docs.fileobjid,function(result){
     range.getrange(req,res,result,docs);
     })*/
})
module.exports = router;