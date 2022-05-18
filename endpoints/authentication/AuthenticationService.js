const jwt = require('jsonwebtoken')
const config = require('config')
var userService = require('../user/UserService')

var jwtKey = config.get('session.tokenKey')
var jwtTimeOut = config.get('session.timeOut')

// check if password of a user matches with given password
function checkUserPassword(userObj, callback){
	// get user obj
	userService.getUserByID(userObj.userID, (err, user) => {
		if(err){
			callback("Error in getUserByID(): " + err)
		} else if(user){
			// found user, check password
			user.comparePassword(userObj.password, (err, isMatch) => {
				if(err){
					callback(err)
				} else if(isMatch) {
					callback(null, isMatch, user)
				} else if(!isMatch){
					callback(null, null, null)
				}
			})
		} else if(!user){
			// did not find user, abort
			callback(null, null, null)
		}
	})
}

function createToken(userObj, callback) {
	if(!userObj){
		callback("userObj missing")
	} else {
		// create token
		let token = jwt.sign({
			"userID": userObj.userID,
			"userName": userObj.userName,
			"isAdministrator": userObj.isAdministrator
		},
		jwtKey, {
			expiresIn: jwtTimeOut,
			algorithm: 'HS256'
		})
		callback(null, token)
	}
}

module.exports = {
	createToken,
	checkUserPassword
}