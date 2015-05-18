/**
 * Created by Bruce LH Li on 05/05/2015.
 */
var JsonHelper = require('./JsonHelper'),
    ObjectID = require('mongodb').ObjectID,
    GridStore = require('mongodb').GridStore,
    Db = require('mongodb').Db,
    Server = require('mongodb').Server;
MongoHelper = function (dbname,host, port) {
    this.db = new Db(dbname, new Server(host, port, {auto_reconnect:true}, {}));
};
MongoHelper.prototype.getObjID = function(){
    return new ObjectID();
}
MongoHelper.prototype.getCollection = function (collectionname,callback) {
    this.db.collection(collectionname, function (error, collection) {
        if (error) callback(error);
        else callback(null, collection);
    });
};
MongoHelper.prototype.savefile = function(req,res,item,buf,callback){
    var filename = item.filename;
    //var gridStore = new GridStore(this.db, new ObjectID(), new ObjectID()+filename.substring(filename.lastIndexOf('.'),filename.size), 'w', {"ContentType":item.filetype});
    var gridStore = new GridStore(this.db, new ObjectID(), filename, 'w', {"ContentType":item.filetype});
    gridStore.open(function (err, gridStore) {
        gridStore.write(buf, function () {
            gridStore.close(function (err, result) {
                if (err) {
                    callback(err,null);
                } else {
                    callback(null,result);
                    //this.savecollection(req,res,item,callback);
                }
            });
        });
    });
}
MongoHelper.prototype.readfile = function(fileId, callback){
    var gridStore = new GridStore(this.db, new ObjectID(fileId));
    gridStore.open(function (err, gridStore) {
        if(err){
            console.log(err,null);
        }else{
            gridStore.read(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    callback(null,data);
                }
            });
        }
    });
}
MongoHelper.prototype.deletefile = function(fileId, callback){
    var gridStore = new GridStore(this.db, new ObjectID(fileId));
    gridStore.open(function (err, gridStore) {
        if(err){
            callback(err,null);
        }else{
            gridStore.unlink(function (err, data) {
                if (err) {
                    callback(err,null);
                } else {
                    callback(null,data);
                }
            });
        }
    });
}
MongoHelper.prototype.savecollection = function(item,collectionname,callback){
/*    this.getCollection(function (error, collection) {
        if (error) callback(error)
        else {
            collection.insert(item, function () {
                callback(null,item);
            });
        }
    });*/
    var itemJson = JsonHelper.ObjectToJson(item);
    this.db.collection(collectionname, function (error, collection) {
        if (error) callback(error);
        else{
            collection.insert(item,{safe:true}, function (err, result) {
                callback(err,result);
            });
        };
    });
}
MongoHelper.prototype.readcollection = function(Id,collectionname,callback){
    this.db.collection(collectionname, function (err, collection) {
        if (err) callback(err,null);
        else{
            /*collection.find({'_id':new ObjectID(Id)},{},function(e,result){
                if(!err)
                    callback(result[0]);
            });*/
            collection.find({'_id':new ObjectID(Id)}).toArray(function(err, result){
                if(!err)
                    callback(null,result[0]);
                else{
                    callback(err,null);
                }

            });
        };
    });
}

exports.MongoHelper = MongoHelper;