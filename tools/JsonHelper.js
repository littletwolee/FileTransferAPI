/**
 * Created by Bruce LH Li on 05/05/2015.
 */
function getJsonStrbyKv(k,v){
    var str = '{"'+k+'":"'+v+'"}';
    return JSON.parse(str);
}
function ObjectToJson(o){
    var str = JSON.stringify(o);
    return JSON.parse(str);
}
function ObjectToJsonStr(o){
    return JSON.stringify(o);
}
exports.getJsonStrbyKv = getJsonStrbyKv;
exports.ObjectToJson = ObjectToJson;
exports.ObjectToJsonStr = ObjectToJsonStr;