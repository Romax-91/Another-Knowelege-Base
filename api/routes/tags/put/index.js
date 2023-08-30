const { ObjectId } = require('mongojs');
const ApiError = require('./../../../exceptions/api-error');
const { findOne } = require('../../../tool/db');

function put(db) {
	return function (req, res, next) {
		const id = req.params?.id;
		const { name } = req?.body;
		try {
			if (!id)
				return next(ApiError.BadRequest('Не передана ссылка на тег!'));
			if (!name) return next(ApiError.BadRequest('Нет данных'));

			const query = {
				_id: ObjectId(id),
			};
			db.tags.findAndModify(
				{
					query,
					update: { $set: { name } },
					new: true,
				},
				(err, doc) => {
					if (err) return next(ApiError.BadRequest(err));
					res.json(doc);
				}
			);
		} catch (error) {
			next(ApiError.BadRequest(err));
		}
	};
}

module.exports = put;
