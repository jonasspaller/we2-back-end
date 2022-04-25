var mongoose = require('mongoose')
const UserModel = require('./UserModel')
var User = mongoose.model('User', UserModel)

// get all users from database
function getUsers(callback) {
	User.find((err, result) => {
		if(result){
			callback(null, result)
		} else {
			callback(err, null)
		}
	})
}

// get one specific user from database
function getOneUser(username, callback){
	User.findOne({userID: username}, (err, result) => {
		if(result){
			callback(null, result)
		} else {
			callback(err, null)
		}
	})
}

// save new user to database, check if user already exists
function saveUser(reqBody, callback) {
	let newUser = new User(reqBody)
	let newUserID = newUser.userID

	// check if a user with this userID already exists
	getOneUser(newUserID, (err, result) => {
		if(result){
			callback("User " + newUserID + " already exists", null)
		} else {
			newUser.save()
			.then((savedUser) => {
				callback(null, savedUser)
			})
			.catch((saveError) => {
				callback(saveError, null)
			})
		}
	})
}

// update user in the database
function updateUser(username, updateBody, callback){
	User.findOneAndUpdate({userID: username}, updateBody, (err, result) => {
		if(result){
			callback(null, result)
		} else {
			callback(err, null)
		}
	})
}

// delete user from database
function deleteUser(username, callback){
	User.deleteOne({userID: username})
	.then(() => {
		callback(null, username)
	}).catch((err) => {
		callback(err, null)
	})
}

module.exports = {
	getUsers,
	saveUser,
	getOneUser,
	updateUser,
	deleteUser
}