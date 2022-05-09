const jwt = require('jsonwebtoken')
const config = require('config')

var jwtKey = config.get('session.tokenKey')

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
		// authorization header is not set or token expired
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
	isAuthenticated,
	isAdmin
}