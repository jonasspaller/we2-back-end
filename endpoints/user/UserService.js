var mongoose = require('mongoose');
const UserModel = require('./UserModel');

var User = mongoose.model('User', UserModel);

function getUsers(callback) {
	User.find((err, users) => {
		if(err){
			console.log("Fehler bei Suche: " + err);
			return callback(err, null);
		} else {
			console.log("Alles super");
			return callback(null, users);
		}
	});
}

function saveUser(reqBody, callback) {

	var newUser = new User(reqBody);

	newUser.save()
		.then(() => {
			callback(null);
		})
		.catch(() => {
			callback("err");
		});

}

module.exports = {
	getUsers,
	saveUser
}