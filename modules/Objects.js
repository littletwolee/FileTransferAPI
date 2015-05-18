/**
 * Created by Bruce LH Li on 08/05/2015.
 */
//returnitem
ReturnItem =  function (err,data) {
    this.err= err;
    this.data = data;
}
exports.ReturnItem = ReturnItem;
//returnresult
Result = function(state,result){
    this.state= state;
    this.result = result;
};
exports.Result = Result;
Files = function (_fileid,_fileName,_fileType,_fileSize){
    this.fileid = _fileid;
    this.filename = _fileName;
    this.filetype = _fileType;
    this.filesize = _fileSize;
};
exports.Files = Files;