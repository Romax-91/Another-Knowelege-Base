const { remove, validateRefresh } = require('./../../../token-service');
const ApiError = require('./../../../exceptions/api-error');

/**
 * Выход пользователя, удаление рефреш токена, удаление пуш токена
 * @param {Object} db БД
 * @returns
 */
function logout(db) {
	return function (req, res, next) {
		const refresh = req.body?.refreshToken ?? req.cookies?.refreshToken;
		if (validateRefresh(refresh)) {
			remove(db, refresh)
				.then((r) => res.json({ result: 'ok' }))
				.catch((err) => next(ApiError.BadRequest(err)));
		} else
			next(
				ApiError.BadRequest('Отказано в доступе! Не корректный токен')
			);
	};
}

module.exports = logout;
