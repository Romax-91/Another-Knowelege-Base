const express = require('express');
const router = express.Router();
const isAuth = require('./../../middlew/is_auth');
const post = require('./post');
const get = require('./get');
const put = require('./put');
const del = require('./del');
const all = require('./all');

/**
 * Теги
 * @param {*} router
 * @param {*} db
 */
function tags(db) {
	// router.get('/posts', posts(db));
	router.get('/tags', all(db));
	router.get('/tags/:id', get(db));

	router.route('/tags').all(isAuth()).post(post(db));
	router.route('/tags/:id').all(isAuth()).put(put(db)).delete(del(db));

	return router;
}

module.exports = tags;
