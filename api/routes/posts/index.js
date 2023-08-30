const express = require('express');
const router = express.Router();
const isAuth = require('./../../middlew/is_auth');
const post = require('./post');
const get = require('./get');
const put = require('./put');
const del = require('./del');

/**
 * Статьи
 * @param {*} router
 * @param {*} db
 */
function posts(db) {
	// router.get('/posts', posts(db));
	router.get('/post/:id', get(db));

	router.route('/post').all(isAuth()).post(post(db));
	router.route('/post/:id').all(isAuth()).put(put(db)).delete(del(db));

	return router;
}

module.exports = posts;
