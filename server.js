var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


require('./models/users_model.js');
require('./models/articals_model.js');

var dburl = "mongodb://zy_admin_01:wangzhiyu_1980@ds147265.mlab.com:47265/zy_prj_mfdm001"
mongoose.Promise = global.Promise;
var conn = mongoose.connect(dburl);


var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser());
app.use(cookieParser('SECRET'));

app.use(expressSession(
	{
		secret: 'SECRET',
		cookie: {maxAge:60*60*1000},
		store: new mongoStore(
            {
            	//db: mongoose.connection.db,
            	//collection: 'sessions',
            	url:dburl,
            	ttl:2 * 60 * 60
            })
	}));

var serverPort = process.env.PORT || 5000;

require('./routes')(app);
app.listen(serverPort);