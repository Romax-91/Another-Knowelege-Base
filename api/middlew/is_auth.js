const ApiError = require('@exceptions/api-error');

/**
 * Проверка авторизации пользователя
 * @returns
 */
function auth() {
	return function (req, res, next) {
		// Проверка авторизации пользователя
		try {
			if (req?.info?.user?.auth) return next();
			return next(ApiError.Unauthorized(3));
		} catch (e) {
			return next(ApiError.Unauthorized(4));
		}
	};
}
module.exports = auth;
