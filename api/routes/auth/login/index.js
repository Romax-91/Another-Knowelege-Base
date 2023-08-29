const bcrypt = require('bcrypt');
const { user } = require('./../fn');
const userDTO = require('../user-dto');
const ApiError = require('./../../../exceptions/api-error');
const { generate, save } = require('./../../../token-service');

/**
 * Авторизация пользователя по логину и паролю
 * @param {Object} db БД
 * @returns
 */
function login(db) {
	return function (req, res, next) {
		try {
			const { email, password } = req.body;
			let usr;
			let tokens;
			// Проверка пользователя
			user(db, { email })
				.then((r) => {
					usr = r;
					if (!r)
						throw new Error(
							'Пользователя с таким именем не существует!'
						);
					if (r.off) throw new Error('Пользователь не активен!');
					// Проверка пароля и токена
					return bcrypt.compare(password, usr.password);
				})
				.then((ok) => {
					if (!ok) throw new Error('Неверный логин или пароль!');
					// Новый токен
					tokens = generate({ ...new userDTO(usr) });

					// Сохранение нового токена
					return save(db, usr._id, tokens.refreshToken);
				})
				.then((r) => res.json({ ...tokens, user: new userDTO(usr) }))
				.catch((err) => next(ApiError.BadRequest(err)));
		} catch (error) {
			console.log(error);
		}
	};
}

module.exports = login;
