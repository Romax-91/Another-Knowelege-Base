const ApiError = require('./../../../exceptions/api-error');
const { ObjectId } = require('mongojs');
const { savePost, saveTags } = require('./fn');

function post(db) {
	return function (req, res, next) {
		const data = req?.body;

		if (!data || !data?.title || !data?.text)
			return next(ApiError.BadRequest('Нет данных'));
		const o = {
			title: data.title,
			text: data.text,
			private: data.private ?? false,
			userId: ObjectId(req.info.user.id),
			create: new Date(),
			update: new Date(),
		};

		let obj;
		savePost(db, o)
			.then((r) => {
				obj = r;
				return saveTags(db, r._id, data.tags);
			})
			.then((r = []) => {
				obj.tags = r;
				res.json(obj);
			})
			.catch((err) => next(ApiError.BadRequest(err)));
	};
}

module.exports = post;
