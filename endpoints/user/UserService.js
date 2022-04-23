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

function getOneUser(username, callback){

	User.findOne({userID: username}, (err, obj) => {
		if(obj){
			callback(null, obj);
		} else {
			callback("User " + username + " konnte nicht gefunden werden", null);
		}
	});

}

function saveUser(reqBody, callback) {

	var newUser = new User(reqBody);

	// check if a user with this username already exists
	var existingUser = getOneUser(newUser.userID, (err, obj) => {

		if(obj){
			callback("User already exists")
		} else {

			newUser.save()
				.then(() => {
					callback(null);
				})
				.catch(() => {
					callback("err");
				});

		}

	});

}

function updateUser(username, updateBody, callback){
	console.log("user to update: " + username);
	User.findOneAndUpdate({userID: username}, updateBody, (err, obj) => {
		if(obj){
			callback();
		} else {
			callback(err);
		}
	});
}

module.exports = {
	getUsers,
	saveUser,
	getOneUser,
	updateUser
}