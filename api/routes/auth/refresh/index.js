const { ObjectId } = require('mongodb');
const UserDTO = require('../user-dto');
const { user } = require('./../fn');
const ApiError = require('./../../../exceptions/api-error');
const {
	validateRefresh,
	findRefresh,
	generate,
	save,
} = require('./../../../token-service');

/**
 * Оновление токенов пользователя
 * @param {Object} db БД
 * @returns
 */
function refresh(db) {
	return function (req, res, next) {
		// получаем токен из кук и body
		const refreshToken =
			req.body?.refreshToken ?? req.cookies?.refreshToken;

		if (!refreshToken) return next(ApiError.Unauthorized(9));
		let usr = validateRefresh(refreshToken);
		let oldTokens;
		let newTokens;
		// Поиск токена
		findRefresh(db, refreshToken)
			.then((tokenInDB) => {
				if (!tokenInDB || !usr || usr.off)
					return Promise.reject(ApiError.Unauthorized(10));
				oldTokens = tokenInDB;
				// Поиск пользователя для обновления его данных
				return user(db, { _id: ObjectId(usr.id) });
			})
			.then((doc) => {
				if (!doc) throw Error('Пользователь не найден!');
				usr = new UserDTO(doc);
				newTokens = generate({ ...usr });

				// Сохраняем токен в БД
				return save(
					db,
					doc._id,
					newTokens.refreshToken,
					oldTokens.refresh
				);
			})
			.then((_) => res.json({ ...newTokens, user: usr }))
			.catch((_) => next(ApiError.Unauthorized(11)));
	};
}

module.exports = refresh;
