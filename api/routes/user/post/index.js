const ApiError = require('./../../../exceptions/api-error');
const { pwd } = require('./../../../routes/auth/fn');
const { findOne } = require('../../../tool/db');

function post(db) {
	return function (req, res, next) {
		const data = req?.body;

		if (!data || !data?.email || !data?.password)
			return next(ApiError.BadRequest('Нет данных'));

		findOne(db, 'users', data.email, 'email')
			.then((r) => {
				if (r)
					return Promise.reject(
						'Пользователь с таким email уже есть!'
					);
				return pwd(data.password);
			})
			.then((password) => {
				if (!password)
					return Promise.reject('Не удалось сохранить пароль!');
				const o = {
					email: data.email,
					password,
					create: new Date(),
				};

				if (data.name) {
					o.name = {
						first: data.name.first ?? '',
						last: data.name.last ?? '',
						middle: data.name.middle ?? '',
					};
				}

				if (data.off !== undefined && typeof data.off == 'boolean')
					o.off = data.off;
				db.users.insert(o, (err, doc) => {
					if (err) return next(ApiError.BadRequest(err));
					delete doc.password;
					res.json(doc);
				});
			})
			.catch((err) => next(ApiError.BadRequest(err)));
	};
}

module.exports = post;
