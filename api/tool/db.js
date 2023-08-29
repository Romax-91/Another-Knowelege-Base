const { ObjectId } = require('mongojs');

/**
 * Вернет весь документ по ключевому полю
 * @param {Object} db БД
 * @param {String} collection Наименование колекции
 * @param {String || Object} val Искомое значение для поиска
 * @param {String} field Наименование ключа
 * @returns
 */
function findOne(db, collection, val, field = '_id') {
	return new Promise((resolve, reject) => {
		try {
			if (!val || !field || !collection) return resolve(null);
			if (field === '_id') val = ObjectId(val);
			const q = {};
			q[field] = val;
			db[collection].findOne(q, (err, doc) =>
				err ? reject(err) : resolve(doc)
			);
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = { findOne };
