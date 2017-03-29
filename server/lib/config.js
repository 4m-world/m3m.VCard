require('use-strict');

var nconf = require('nconf');

nconf
    .argv()
    .file('localization', {file : __dirname + '/../config/localization.json'})
    .file({file: __dirname + '/../config/app.json'});

module.exports = nconf;