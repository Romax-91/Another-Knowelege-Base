const express = require('express');
const router = express.Router();
const isAuth = require('./../../middlew/is_auth');
const post = require('./post');
const get = require('./get');
const put = require('./put');
const del = require('./del');

/**
 * Пользователь
 * @param {*} router
 * @param {*} db
 */
function user(db) {
	router.route('/user').all(isAuth()).post(post(db));
	router
		.route('/user/:id')
		.all(isAuth())
		.get(get(db))
		.put(put(db))
		.delete(del(db));

	return router;
}

module.exports = user;
