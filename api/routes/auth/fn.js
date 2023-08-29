const bcrypt = require('bcrypt');

/**
 * Шифруем пароль
 * @param {String} password пароль пользователя
 * @returns String 
 */
function pwd(password) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 3, (err, hash) => {
			if (!hash) return reject(err ?? 'Обратитесь к администратору!');
			resolve(hash);
		});
	});
}

/**
 * Получение данных пользователя
 * @param {String} email Почта пользователя
 * @returns Object
 */
function user(db, q) {
	return new Promise((resolve, reject) => {
		db.users.findOne(q, (err, doc) => {
			if (err) reject(err);
			resolve(doc);
		});
	});
}

module.exports = { pwd, user };
