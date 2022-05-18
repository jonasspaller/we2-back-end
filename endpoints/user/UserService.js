const User = require('./UserModel')

// get all users from database
function getUsers(callback) {
	User.find((err, result) => {
		if(err){
			callback(err)
		} else if(!result){
			callback(null, null)
		} else {
			callback(null, result)
		}
	})
}

// get one specific user from database
function getUserByID(userID, callback){
	User.findOne({userID: userID}, (err, result) => {
		if(err){
			callback(err)
		} else if(!result){
			callback(null, null)
		} else {
			callback(null, result)
		}
	})
}

// save new user to database, check if user already exists
function saveUser(newUserID, reqBody, callback) {
	let newUser = new User(reqBody)

	// check if a user with this userID already exists
	getUserByID(newUserID, (err, result) => {
		if(!result){
			newUser.save()
			.then((savedUser) => {
				callback(null, savedUser)
			})
			.catch((saveErr) => {
				callback(saveErr)
			})
		} else if(result){
			callback(null, null)
		} else if(err){
			callback("Error in getUserByID(): " + err)
		}
	})
}

// update user in the database
function updateUser(username, updateBody, callback){

	// get user document from db
	getUserByID(username, (err, result) => {
		if(!result){
			callback(null, null)
		} else if(result){
			// user found, time to update

			Object.assign(result, updateBody)

			result.save()
			.then((savedUser) => {
				callback(null, savedUser)
			})
			.catch((updateErr) => {
				callback(updateErr)
			})
		} else if(err){
			callback("Error in getUserByID(): " + err)
		}
	})
}

// delete user from database
function deleteUser(username, callback){
	// get user document from db
	getUserByID(username, (err, result) => {
		if(!result){
			callback(null, null)
		} else if(result) {
			User.deleteOne({userID: username})
			.then((deletedUser) => {
				callback(null, deletedUser)
			}).catch((deleteErr) => {
				callback(deleteErr)
			})
		} else if(err){
			callback("Error in getUserByID(): " + err)
		}
	})
}

// check for default admin
function checkDefaultAdmin(){
	// save default admin
	const data = {
		userID: "admin",
		userName: "Admin",
		password: "123",
		isAdministrator: true
	}

	saveUser(data.userID, data, (err, result) => {
		if(!result){
			console.log("checkDefaultAdmin(): admin already exists")
		} else if(result){
			console.log("checkDefaultAdmin(): created default admin: " + result)
		} else if(err){
			console.log("checkDefaultAdmin(): Error: " + err, null)
		}
	})
}

module.exports = {
	getUsers,
	saveUser,
	getUserByID,
	updateUser,
	deleteUser,
	checkDefaultAdmin
}