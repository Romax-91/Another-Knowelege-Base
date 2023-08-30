const { ObjectId } = require('mongojs');

/**
 * Удаление статьи
 * @param {*} db
 * @param {*} postId
 * @returns
 */
function delPost(db, postId) {
	return new Promise((resolve, reject) => {
		try {
			db.posts.remove({ _id: ObjectId(postId) }, (err) => {
				if (err) return reject(err);
				resolve();
			});
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Удаление связанных ссылок на Теги
 * @param {*} db
 * @param {*} postId
 * @returns
 */
function delTags(db, postId) {
	return new Promise((resolve, reject) => {
		try {
			db.posts_tags.remove({ postId: ObjectId(postId) }, (err) => {
				if (err) return reject(err);
				resolve();
			});
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = { delPost, delTags };
