var express         = require("express");
var path            = require("path");
var favicon         = require("serve-favicon");
var logger          = require("morgan");
var cookieParser    = require("cookie-parser");
var bodyParser      = require("body-parser");
var session         = require("express-session");
var moment          = require("moment");
var compress        = require('compression');
var helmet          = require('helmet');

var app = express();

// View engine setup
var handlebars = require('express-handlebars')
    .create({
        defaultLayout : 'main',
        extname : '.hbs',
        helpers : require('./lib/view/helpers')
    });

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

// Add single refernce to the model into application object
// and reuse it whenever an access to DB is needed
app.set('db_model', require('./lib/model/db'));

app.use(helmet());
app.use(compress());
// uncomment after placing favion in /pulblic folder
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup authentication mechanism
var passport = require('./lib/passport')();
// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')('session.Store');
app.use(session({
    secret : 'what secret you are talking about; asdlk098kj;87;asd',
    resave : false,
    saveUninitialized : false,
    store : new SequelizeStore({
        db : app.get('db_model').sequelize
    })
}));

app.use(passport.initalize());
app.use(passport.session());

// Custom middlewares
app.use(function(req, res, next){
    res.locals.session = req.session;
    res.locals.logged_user = req.user;
    res.locals.url_to_the_site_root = '/';
    res.locals.requested_path = req.originalUrl;
    next();
});

app.use(function(req, res, next){
    res.locals.custom_java_script = [
        '/js/bootstrap-datepicker.js'
    ];
    res.locals.custom_css = [
        '/css/bootstrap-datepicker3.standalone.css'
    ];

    next();
});

// Enable flash messages within session
app.use(require('./lib/middleware/flash_messages'));
app.use(require('./lib/middleware/session_aware_redirect'));

// Here will be publicly accessible routes

app.use('/', 
    require('./lib/route/home.js'));

app.use('/cards/', require('./lib/route/cards.js'));
app.use('/account/', require('./lib/route/accounts.js'));
app.use('/profile/', require('./lib/route/profile.js'));
app.use('/payment/', require('./lib/route/payment.js'));
app.use('/users/', require('./lib/route/payment.js'));
app.use('/notification/', require('./lib/route/payment.js'));
app.use('/dashboard/', require('./lib/route/payment.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

if(app.get('env') === 'development') {
    app.use(function(err, req, res, next){
        res.status(err.static || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

if(app.get('env') === 'development') {
    app.use(function(err, req, res, next){
        res.status(err.static || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function(err, req, res, next){
    res.status(err.static || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;