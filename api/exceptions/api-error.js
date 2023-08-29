// Обработка ошибок связанных с работой нашего API
module.exports = class ApiError extends Error {
	status;
	errors;

	constructor(status, message, errors) {
		super(message);
		this.status = status;
		this.errors = errors;
	}

	// Не авторизованный пользователь
	static Unauthorized(stat) {
		return new ApiError(401, 'Пользователь не авторизован. Код:' + stat);
	}
	/**
	 * Не корректный запрос
	 * @param {String} message Сообщение
	 * @param {Array} errors Массив ошибок
	 * @returns
	 */
	static BadRequest(message, errors = []) {
		return new ApiError(400, message, errors);
	}
	// Не корректный запрос
	static NotAcceptable(message, errors = []) {
		return new ApiError(406, message, errors);
	}
	// Не поддерживается версия приложения
	static Unsupported(st) {
		console.log('\n<ApiError-420-Unsupported>', st);
		return new ApiError(
			420,
			'Версия приложения устарела. Обновите приложение!'
		);
	}
};
