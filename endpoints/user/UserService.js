var mongoose = require('mongoose')
const User = require('./UserModel')

// get all users from database
function getUsers(callback) {
	User.find((err, result) => {
		if(err){
			callback({"Error": "An error occured while trying to get users: " + err}, 500, null)
		} else {
			callback(null, 200, result)
		}
	})
}

// get one specific user from database
function getUserByID(userID, callback){
	User.findOne({userID: userID}, (err, result) => {
		if(err){
			callback({"Error": "An error occured in getUserByID(): " + err}, 500, null)
		} else if(!result){
			callback({"Error": "user " + userID + " was not found"}, 404, null)
		} else {
			callback(null, 200, result)
		}
	})
}

// save new user to database, check if user already exists
function saveUser(reqBody, callback) {
	let newUser = new User(reqBody)
	let newUserID = newUser.userID

	// check if new user has a userID set
	if(newUserID == undefined || newUserID == null){
		callback({"Error": "cannot set a new user without userID"}, 400, null)
	} else {
		// check if a user with this userID already exists
		getUserByID(newUserID, (err, status, result) => {
			if(!result){
				newUser.save()
				.then((savedUser) => {
					callback(null, 201, savedUser)
				})
				.catch(() => {
					callback({"Error": "An error occured while trying to save user " + newUserID + ": " + err}, 500, null)
				})
			} else if(result){
				callback({"Error": "User " + newUserID + " already exists"}, 400, null)
			} else if(err){
				callback({"Error": "An error occured in getUserByID(): " + err}, status, null)
			}
		})
	}
}

// update user in the database
function updateUser(username, updateBody, callback){

	// get user document from db
	getUserByID(username, (err, status, result) => {
		if(!result){
			callback(err, status, null)
		} else {
			// user found, time to update

			Object.assign(result, updateBody)

			result.save()
			.then((savedUser) => {
				callback(null, 200, savedUser)
			})
			.catch(() => {
				callback({"Error": "An error occured while trying to save user " + username + ": " + err}, 500, null)
			})
		}
	})
}

// delete user from database
function deleteUser(username, callback){
	// get user document from db
	getUserByID(username, (err, status, result) => {
		if(!result){
			callback(err, status, null)
		} else {
			User.deleteOne({userID: username})
			.then((deletedUser) => {
				callback(null, 204, deletedUser)
			}).catch((err) => {
				callback({"Error": "An error occured while trying to delete " + username + ": " + err}, 500, null)
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