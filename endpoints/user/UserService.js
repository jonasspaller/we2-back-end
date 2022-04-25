var mongoose = require('mongoose')
const { update } = require('./UserModel')
const User = require('./UserModel')
//var User = mongoose.model('User', UserModel)

// get all users from database
function getUsers(callback) {
	User.find((err, result) => {
		if(result){
			callback(null, result)
		} else {
			callback({"Error": "An error occured while trying to get users: " + err})
		}
	})
}

// get one specific user from database
function getUserByID(userID, callback){
	User.findOne({userID: userID}, (err, result) => {
		if(result){
			callback(null, result)
		} else {
			callback({"Error": "user " + userID + " was not found"})
		}
	})
}

// save new user to database, check if user already exists
function saveUser(reqBody, callback) {
	let newUser = new User(reqBody)
	let newUserID = newUser.userID

	// check if a user with this userID already exists
	getUserByID(newUserID, (err, result) => {
		if(result){
			callback("User " + newUserID + " already exists")
		} else {
			newUser.save()
			.then((savedUser) => {
				callback(null, savedUser)
			})
			.catch(() => {
				callback({"Error": "An error occured while trying to save user " + req.body.userID + ": " + err})
			})
		}
	})
}

// update user in the database
function updateUser(username, updateBody, callback){

	// get user document from db
	getUserByID(username, (err, result) => {
		if(!result){
			callback({"Error": "The user " + username + " does not exist"})
		} else if(err){
			callback({"Error": "An error occured in getOneUser(): " + err})
		} else if(result){
			// user found, time to update

			Object.assign(result, updateBody)

			result.save()
			.then((savedUser) => {
				callback(null, savedUser)
			})
			.catch(() => {
				callback({"Error": "An error occured while trying to save user " + username + ": " + err})
			})
		}
	})
}

// delete user from database
function deleteUser(username, callback){
	// get user document from db
	getUserByID(username, (err, result) => {
		if(!result){
			callback({"Error": "The user " + username + " does not exist"})
		} else if(err){
			callback({"Error": "An error occured in getOneUser(): " + err})
		} else if(result){
			User.deleteOne({userID: username})
			.then(() => {
				callback(null, username)
			}).catch((err) => {
				callback({"Error": "An error occured while trying to delete " + username + ": " + err})
			})
		}
	})
}

module.exports = {
	getUsers,
	saveUser,
	getUserByID,
	updateUser,
	deleteUser
}