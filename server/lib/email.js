require('use-strict');

var bluebird    = require('bluebird'),
    handlebars  = require('express-handlebars').create({
        partialsDir: __dirname +'/../views/partials/',
        extname: '.hbs',
        helpers: require('./view/helpers')()
    }),
    config      = require('./config'),
    nodemailer  = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

function Email() { };

function _promise_to_unflod_context(context) {
    if(context.hasOwnProperty('user')){
        return context.user.reload_with_session_details();
    } else {
        return bluebird.resolve(1);
    }
}

