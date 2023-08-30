const ApiError = require('./../../../exceptions/api-error');
const { findOne } = require('../../../tool/db');

function post(db) {
	return function (req, res, next) {
		console.log(req?.body);
		const { name } = req?.body;

		if (!name) return next(ApiError.BadRequest('Нет данных'));
		findOne(db, 'tags', name, 'name').then((r) => {
			if (r)
				return next(ApiError.BadRequest('Такой тег уже существует!'));
			db.tags.insert({ name }, (err, doc) => {
				err ? next(ApiError.BadRequest(err)) : res.json(doc);
			});
		});
	};
}

module.exports = post;
