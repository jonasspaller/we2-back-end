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
		return
	}

	// create token
	var issuedAt = new Date().getTime()
	var expiresAt = issuedAt + jwtTimeOut
	let token = jwt.sign({
		"userID": userObj.userID,
		"userName": userObj.userName,
		"isAdministrator": userObj.isAdministrator
	},
	jwtKey, {
		expiresIn: expiresAt,
		algorithm: 'HS256'
	})
	callback(null, token, userObj)
}

// check authorization middleware
function isAuthenticated(req, res, next){
	if(typeof req.headers.authorization !== "undefined"){
		let token = req.headers.authorization.split(" ")[1]

		var user
		try {
			user = jwt.verify(token, jwtKey, {algorithm: "HS256"})
		} catch(err){
			return res.status(401).json({"Error": "invalid token"})
		}
		
		// pass user to next middleware
		res.locals.user = user
		return next()
	} else {
		// authorization header is not set, token expired or user is no admin
		return res.status(401).json({"Error": "Unauthorized"})
	}
}

// check if user from previous middleware is admin
function isAdmin(req, res, next){
	const user = res.locals.user
	if(user){
		// check if admin
		if(user.isAdministrator){
			return next()
		} else {
			return res.status(401).json({"Error": "user is no admin"})
		}
	}
}

module.exports = {
	createToken,
	checkUserPassword,
	isAuthenticated,
	isAdmin
}