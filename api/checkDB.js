const { pwd } = require('./routes/auth/fn');

function checkDB(db) {
	const defUser = process.env?.ROOT_USER
		? JSON.parse(process.env.ROOT_USER)
		: {
				email: 'root@mail.com',
				password: '123456789',
		  };
	db.users.findOne({ email: defUser.email }, (err, doc) => {
		if (err) return console.error(err);
		if (!doc) {
			pwd(defUser.password)
				.then((new_pwd) => {
					console.log('Добавление root пользователя', defUser);
					defUser.password = new_pwd;
					defUser.create = new Date();
					db.users.insert(defUser);
				})
				.catch(console.error);
		}
	});
}

module.exports = checkDB;
