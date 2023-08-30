/**
 * Получение тегов статьи
 * @param {*} db
 * @param {*} postId
 * @returns
 */
function getTags(db, postId) {
	return new Promise((resolve, reject) => {
		db.posts_tags.find({ postId }, (err, tags) => {
			if (err) return reject(err);
			tags = tags.map((el) => el.tagId);
			db.tags.find({ _id: { $in: tags } }, (err, docs) =>
				err ? reject(err) : resolve(docs)
			);
		});
	});
}
module.exports = { getTags };
