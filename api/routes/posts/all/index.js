const { ObjectId } = require('mongojs');
const ApiError = require('./../../../exceptions/api-error');
const { find } = require('../../../tool/db');
const posts = require('./fn');

/**
 * Получение статей с фильтрацией
 * Если не передавать Query params то получим все статьи
 * Query params: tags- Фильтрация по тегам; page- постраничный вывод
 * @param {*} db
 * @returns
 */
function all(db) {
	return function (req, res, next) {
		let { tags, page } = req.query;
		let q;
		try {
			if (tags) {
				tags = JSON.parse(tags).map((el) => ObjectId(el));
				q = { tagId: { $in: tags } };
			}

			const p = q ? find(db, 'posts_tags', q) : Promise.resolve(null);

			p.then((r) => {
				if (r) {
					const set = new Set(r.map((el) => el.postId.toString()));
					const arr = Array.from(set).map((el) => ObjectId(el));
					return posts(db, req.info.user.auth, page, arr);
				}
				return posts(db, req.info.user.auth, page);
			})
				.then((r) => {
					res.json({ posts: r });
				})
				.catch((err) => {
					console.log(err);
					next(ApiError.BadRequest(err));
				});
		} catch (error) {
			next(ApiError.BadRequest(error));
		}
	};
}
module.exports = all;
