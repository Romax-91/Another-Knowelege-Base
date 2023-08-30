const ApiError = require('./../../../exceptions/api-error');
const { findOne } = require('../../../tool/db');
const { getTags } = require('./fn');

function get(db) {
	return function (req, res, next) {
		const id = req.params.id;
		if (!id)
			return next(ApiError.BadRequest('Не передана ссылка на статью!'));

		Promise.all([findOne(db, 'posts', id), getTags(db, id)])
			.then(([post, tags]) => {
				if (!post)
					return next(ApiError.BadRequest('Статья не найдена!'));
				if (post.private && !req.info.user.auth)
					return next(ApiError.BadRequest('Статья вам не доступна!'));
				post.tags = tags;
				res.json(post);
			})
			.catch((err) => next(ApiError.BadRequest(err)));
	};
}

module.exports = get;
