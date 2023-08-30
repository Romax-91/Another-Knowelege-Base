const { getTags } = require('../get/fn');

function posts(db, auth, page, list) {
	return new Promise((resolve, reject) => {
		let count = 0;
		let end = false;
		let result = [];
		const row = 2;

		const s = { create: -1 };
		const q = {};
		if (list) {
			q._id = { $in: list };
		}
		if (auth) q.private = { $eq: true };

		let cur;
		if (page) {
			cur = db.posts
				.find(q)
				.sort(s)
				.limit(row)
				.skip(row * page);
		} else cur = db.posts.find(q).sort(s);

		cur.on('error', reject);
		cur.on('end', (_) => {
			end = true;
			if (!count) resolve(result);
		});
		cur.on('data', (doc) => {
			++count;
			result.push(doc);
			getTags(db, doc._id)
				.then((r = []) => {
					doc.tags = r;
					if (--count) return;
					if (!end) return;
					resolve(result);
				})
				.catch((err) => {
					cur.destroy();
					reject(err);
				});
		});
	});
}

module.exports = posts;
