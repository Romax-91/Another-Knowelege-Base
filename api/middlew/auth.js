const ApiError = require('./../exceptions/api-error');
const { validateAccess } = require('./../token-service');

/**
 * Обработка токенa в запросе
 */
module.exports = function (req, res, next) {
	try {
		req.info = {
			user: {
				auth: false,
			},
		};

		// Получаем акцесс токен из хедера
		const auth = req.headers.authorization;
		if (!auth) return next();

		// Проверяем токен
		const access = auth.split(' ')[1];
		if (!access) return next();

		// Валидация токена
		const user = validateAccess(access);
		if (!user) return next();

		// Записываем все о пользователе
		req.info.user = { ...user };
		next();
	} catch (e) {
		return next(ApiError.Unauthorized(1));
	}
};
