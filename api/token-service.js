const jwt = require('jsonwebtoken');

/**
 * Генерируем новый токен
 * @param {Object} payload Данные пользователя
 * @returns
 */
function generate(payload) {
	const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
		expiresIn: process.env.ACCESSS_EXPIRE,
	});
	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.REFRESH_EXPIRE,
	});
	return {
		accessToken,
		refreshToken,
	};
}

/**
 * Сохраняем токен пользователя в БД
 * @param {Object} db БД
 * @param {ObjectId} userId Ссылка на пользователя
 * @param {String} refresh Новый рефреш токен
 * @param {String} oldrefresh Старый Рефреш токен
 * @returns
 */
function save(db, userId, refresh, oldrefresh) {
	return new Promise((resolve, reject) => {
		const o = {
			userId,
			refresh,
			update: new Date(),
		};
		db.token.update(
			{ userId, refresh: oldrefresh },
			{ $set: o },
			{ upsert: true },
			(err, doc) =>
				err ? reject('Не удалось сохранитиь новый токен') : resolve(doc)
		);
	});
}

/**
 * Удаление токена из бд
 * @param {Object} db БД
 * @param {String} refresh Рефреш токен
 * @returns
 */
function remove(db, refresh = null) {
	return new Promise((resolve, reject) => {
		if (!refresh) return resolve(true);
		db.token.remove({ refresh }, (err, doc) => {
			if (err) return reject(err);
			if (!doc.ok) throw new Error('Не удалось выполнить выход');
			resolve(doc);
		});
	});
}

/**
 * Валидация акцесс токена
 * @param {String} token Акцесс токен
 * @returns
 */
function validateAccess(token) {
	try {
		const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		return data;
	} catch (error) {
		return null;
	}
}

/**
 * Валидация рефреш токена
 * @param {string} token Рефреш токен
 * @returns
 */
function validateRefresh(token) {
	try {
		const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

// Поиск токена в БД
function findRefresh(db, token) {
	return new Promise((reject, resolve) => {
		if (!token) reject(null);
		db.token.findOne({ refresh: token }, (err, doc) => {
			if (err) resolve(err);
			reject(doc);
		});
	});
}

module.exports = {
	generate,
	save,
	remove,
	validateAccess,
	validateRefresh,
	findRefresh,
};
