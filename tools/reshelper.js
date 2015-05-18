/**
 * Created by Bruce LH Li on 15/05/2015.
 */
var JsonHelper = require('./JsonHelper'),
    Objects = require('../modules/Objects');
function sendres(res,err,result,mes,callback,iscallback){
    if(err){
        res.write(JsonHelper.ObjectToJsonStr(new Objects.Result('err',err.errorMessages)));
        if(!iscallback){
            res.end();
        }else{
            callback(res);
        }
    }else if(result == null){
        res.write(JsonHelper.ObjectToJsonStr(new Objects.Result('err',mes)));
        if(!iscallback) {
            res.end();
        }else{
            callback(res);
        }
    }else{
        callback(true);
    }
}
exports.sendres = sendres;