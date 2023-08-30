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
				return { tagId: ObjectId(el), postId };
			});

			db.posts_tags.insertMany(arr, (err, docs) => {
				if (err) return reject(err);
				docs = docs.map((el) => el.tagId);
				return findTags(db, docs);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function findTags(db, tagsId) {
	return new Promise((resolve, reject) => {
		const q = { _id: { $in: tagsId } };
		db.tags.find(q, (err, docs) => {
			if (err) return reject(err);
			return resolve(docs.map((el) => el.name));
		});
	});
}

module.exports = { savePost, saveTags };
