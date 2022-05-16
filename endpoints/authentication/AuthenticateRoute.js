var express = require('express')
var router = express.Router()
var authenticationService = require('./AuthenticationService.js')

// GET requests
router.get('/', (req, res) => {
	// check if basic authentication header is sent
	if(!req.headers.authorization || req.headers.authorization.indexOf('Basic') === -1){
		res.status(401)
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
		res.json({"Error": "missing authorization header"})
	} else {
		// authorization header ist set, check if correct
		const base64Credentials = req.headers.authorization.split(" ")[1]
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
		const[userID, password] = credentials.split(':')

		// compare passwords
		authenticationService.checkUserPassword({userID, password}, (err, isMatch, userObj) => {
			if(err){
				res.status(500)
				res.json({"Error": "internal error in authenticationService.checkUserPassword(): " + err})
			} else if(isMatch){
				authenticationService.createToken(userObj, (err, token) => {
					if(err){
						res.status(500)
						res.json({"Error": "internal error in createToken(): " + err})
					} else if(!token){
						res.status(500)
						res.json({"Error": "could not create token"})
					} else if(token){
						res.header("Authorization", "Bearer " + token)
						res.json({"Message": "token created successfully"})
					}
				})
			} else if(!isMatch){
				res.status(401)
				res.json({"Error": "invalid authentication credentials"})
			}
		})
	}
})

module.exports = router