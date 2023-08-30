const ApiError = require('./../../../exceptions/api-error');
const { delTags, delTag } = require('./fn');

function del(db) {
	return function (req, res, next) {
		try {
			const id = req.params?.id;
			if (!id)
				return next(ApiError.BadRequest('Не передана ссылка на тег!'));

			// Удаление тега
			const p = [delTag(db, id), delTags(db, id)];
			Promise.all(p)
				.then((_) => res.json({ result: 'ok' }))
				.catch((err) => next(ApiError.BadRequest(err)));
		} catch (error) {
			next(ApiError.BadRequest(err));
		}
	};
}

module.exports = del;
