var fs = require('fs');
var path = 'Build';
fs.readdir(path, (err, list) => {
    if (err) throw err;
    var i = 0;
    (function next() {
        var file = list[i++];
        fs.stat(path + '/' + file, function(err, stat) {
            //TODO: logic for deciding what to rename directory
            if (stat && stat.isDirectory()) {
                fs.rename(path + '/' + file, path + '/' + 'ANDROID', function(err) {
                    if (err) return console.error(err)
                    console.log("rename success! ", path + '/' + file, ' to -> ', path + '/' + 'ANDROID');
                });
            }
        });
    })();
});