const { ObjectId } = require('mongojs');
const ApiError = require('./../../../exceptions/api-error');
const { pwd } = require('./../../../routes/auth/fn');
const { findOne } = require('../../../tool/db');

function put(db) {
	return function (req, res, next) {
		const id = req.params?.id;
		const data = req?.body;
		try {
			if (!id)
				return next(
					ApiError.BadRequest('Не передана ссылка на пользователя!')
				);
			if (!data) return next(ApiError.BadRequest('Нет данных'));

			const p = data.email
				? findOne(db, 'users', data.email, 'email')
				: Promise.resolve();
			p.then((r) => {
				if (r && r._id.toString() !== id)
					return Promise.reject(
						'Пользователь с таким email уже есть!'
					);
				return data.password
					? pwd(data.password)
					: Promise.resolve(null);
			})
				.then((r) => {
					if (r) data.password = r;
					data.update = new Date();
					const query = {
						_id: ObjectId(id),
					};
					db.users.findAndModify(
						{
							query,
							update: { $set: data },
							new: true,
						},
						(err, doc) => {
							if (err) return next(ApiError.BadRequest(err));
							delete doc.password;
							res.json(doc);
						}
					);
				})
				.catch((err) => next(ApiError.BadRequest(err)));
		} catch (error) {
			next(ApiError.BadRequest(err));
		}
	};
}

module.exports = put;
