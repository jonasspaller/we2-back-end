const jwt = require('jsonwebtoken')
const config = require('config')

var jwtKey = config.get('session.tokenKey')

// check authorization middleware
function isAuthenticated(req, res, next){
	if(typeof req.headers.authorization !== "undefined"){
		let token = req.headers.authorization.split(" ")[1]

		//user = jwt.verify(token, jwtKey, {algorithm: "HS256"})
		jwt.verify(token, jwtKey, {algorithm: "HS256"}, (err, decoded) => {
			if(err){
				return res.status(401).json({"Error": "invalid token"})
			} else if(decoded){
				console.log("Token expires in " + decoded.exp)
				res.locals.user = decoded
				return next()
			}
		})
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