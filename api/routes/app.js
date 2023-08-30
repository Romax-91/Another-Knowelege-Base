var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const authMiddleW = require('./middlew/auth');

var indexRouter = require('./routes/index');
const auth = require('./routes/auth');
const user = require('./routes/user');
const posts = require('./routes/posts');

function App(db) {
	var app = express();

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'pug');

	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));

	app.use('/', indexRouter);

	app.use(authMiddleW);
	if (db) {
		app.use('/auth', auth(db));
		app.use(user(db));
		app.use(posts(db));
		app.use(tags(db));
	}

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		next(createError(404));
	});

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});

	return app;
}
module.exports = App;
