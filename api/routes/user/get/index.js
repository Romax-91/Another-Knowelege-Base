const ApiError = require('./../../../exceptions/api-error');
const { findOne } = require('../../../tool/db');

function get(db) {
	return function (req, res, next) {
		const id = req.params.id;
		if (!id)
			return next(
				ApiError.BadRequest('Не передана ссылка на пользователя!')
			);

		findOne(db, 'users', id)
			.then((r) => {
				if (!r)
					return next(ApiError.BadRequest('Пользователя не найден!'));
				delete r.password;
				res.json(r);
			})
			.catch((err) => next(ApiError.BadRequest(err)));
	};
}

module.exports = get;
