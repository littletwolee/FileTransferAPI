/**
 * Created by Bruce LH Li on 14/05/2015.
 */
var debug = require('debug')('my-application');
var app = require('./app');
var cluster = require('cluster');
/*app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});*/
var server = null;
var numCPUs = require('os').cpus().length ;

if (cluster.isMaster) {
    console.log('[master] ' + "start master...");

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('listening', function (worker, address) {
        console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    });

} else if (cluster.isWorker) {
    app.set('port', process.env.PORT || 3000);
    server = app.listen(app.get('port'), function() {
        debug('Express server listening on port ' + server.address().port);
    });
}
