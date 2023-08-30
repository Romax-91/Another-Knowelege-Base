const { ObjectId } = require('mongojs');

/**
 * Удаление тега
 * @param {*} db
 * @param {*} tagId
 * @returns
 */
function delTag(db, tagId) {
	return new Promise((resolve, reject) => {
		try {
			db.tags.remove({ _id: ObjectId(tagId) }, (err) => {
				if (err) return reject(err);
				resolve();
			});
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Удаление связанных ссылок на Тег
 * @param {*} db
 * @param {*} postId
 * @returns
 */
function delTags(db, tagId) {
	return new Promise((resolve, reject) => {
		try {
			db.posts_tags.remove({ tagId: ObjectId(tagId) }, (err) => {
				if (err) return reject(err);
				resolve();
			});
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = { delTag, delTags };
