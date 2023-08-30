const ApiError = require('../../../exceptions/api-error');

function get(db) {
	return function (req, res, next) {
		db.tags.find({}).sort({ name: 1 }, (err, docs) => {
			if (err) return next(ApiError.BadRequest(err));
			res.json(docs);
		});
	};
}

module.exports = get;
