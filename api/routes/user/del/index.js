const { ObjectId } = require('mongojs');
const ApiError = require('./../../../exceptions/api-error');

function del(db) {
	return function (req, res, next) {
		try {
			const id = req.params?.id;
			if (!id)
				return next(
					ApiError.BadRequest('Не передана ссылка на пользователя!')
				);

			db.users.remove({ _id: ObjectId(id) }, (err) =>
				err
					? next(ApiError.BadRequest(err))
					: res.json({ result: 'ok' })
			);
		} catch (error) {
			next(ApiError.BadRequest(err));
		}
	};
}

module.exports = del;
