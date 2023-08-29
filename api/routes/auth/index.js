const login = require('./login');
const logout = require('./logout');
const refresh = require('./refresh');
const express = require('express');
const router = express.Router();

/**
 * Авторизация пользователей
 * @param {*} router
 * @param {*} db
 */
function auth(db) {
	router.post('/login', login(db));
	router.post('/logout', logout(db));
	router.post('/refresh', refresh(db));

	return router;
}

module.exports = auth;
