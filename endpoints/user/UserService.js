var mongoose = require('mongoose');
const UserSchema = require('./UserModel');
var User = mongoose.model('User', UserSchema);

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

module.exports = {
	getUsers
}