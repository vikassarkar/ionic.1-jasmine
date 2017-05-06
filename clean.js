//clean package & build directory
var fs = require('fs-extra');

fs.emptyDir('Package', function (err) {
  if (!err) console.log('cleaned Package/')
});
fs.emptyDir('Build', function (err) {
  if (!err) console.log('cleaned Build/')
});