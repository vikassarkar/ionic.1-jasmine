var file_system = require('fs');
var archiver = require('archiver');
var zipPath = 'Package/package.zip';

var dir = 'Package';
if (!file_system.existsSync(dir)){
	file_system.mkdirSync(dir);
}

var output = file_system.createWriteStream(zipPath);
var archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);
archive.bulk([
    { expand: true, cwd: 'WebContent', src: ['**/*'], dest: 'WebContent.Master'},
    { expand: true, cwd: 'UXFMEContent/build-config', src: ['**']},
    { expand: true, cwd: 'UXFMEContent/certs', src: ['**']},
    { expand: true, cwd: 'UXFMEContent/images', src: ['**']}
]);
archive.finalize();