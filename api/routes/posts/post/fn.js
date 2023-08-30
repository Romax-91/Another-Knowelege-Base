const { ObjectId } = require('mongojs');

/**
 * Добавление статьи
 * @param {*} db
 * @param {*} obj
 */
function savePost(db, obj) {
	return new Promise((resolve, reject) => {
		db.posts.insert(obj, (err, doc) => {
			err ? reject(err) : resolve(doc);
		});
	});
}

/**
 * Добавление связанных тегов с постом
 * @param {*} db
 * @param {*} postId
 * @param {*} tags
 * @returns
 */
function saveTags(db, postId, tags = []) {
	return new Promise((resolve, reject) => {
		try {
			if (!Array.isArray(tags)) return reject('Не корректные данные!');
			if (!tags.length) return resolve();

			const arr = tags.map((el) => {
				return { tagId: ObjectId(el), postId: ObjectId(postId) };
			});

			db.posts_tags.insertMany(arr, (err, docs) => {
				if (err) return reject(err);
				docs = docs.map((el) => el.tagId);
				resolve(docs);
			});
		} catch (error) {
			reject(error);
		}
	});
}
module.exports = { savePost, saveTags };
