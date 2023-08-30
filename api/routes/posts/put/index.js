const { ObjectId } = require('mongojs');
const ApiError = require('./../../../exceptions/api-error');
const { saveTags } = require('../post/fn');
const { getTags } = require('../get/fn');
const { delTags } = require('../del/fn');

function put(db) {
	return function (req, res, next) {
		const id = req.params?.id;
		const data = req?.body;
		try {
			if (!id)
				return next(
					ApiError.BadRequest('Не передана ссылка на статью!')
				);
			if (!data) return next(ApiError.BadRequest('Нет данных'));

			const p = data.tags ? delTags(db, id) : Promise.resolve();
			p.then((_) => {
				return data.tags
					? saveTags(db, id, data.tags)
					: Promise.resolve();
			})
				.then((_) => getTags(db, id))
				.then((tags) => {
					delete data.tags;
					data.update = new Date();
					const query = {
						_id: ObjectId(id),
					};
					db.posts.findAndModify(
						{
							query,
							update: { $set: data },
							new: true,
						},
						(err, doc) => {
							if (err) return next(ApiError.BadRequest(err));
							doc.tags = tags;
							res.json(doc);
						}
					);
				});
		} catch (error) {
			next(ApiError.BadRequest(error));
		}
	};
}

module.exports = put;
