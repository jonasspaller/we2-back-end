var express = require('express')
var router = express.Router()
var userService = require('../user/UserService')

// GET requests
router.get('/', (req, res) => {
	// check if basic authentication header is sent
	if(!req.headers.authorization || req.headers.authorization.indexOf('Basic') === -1){
		res.status(401)
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
		res.send({"Error": "missing authorization header"})
	} else {
		// authorization header ist set, check if correct
		const base64Credentials = req.headers.authorization.split(" ")[1]
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
		const[userID, password] = credentials.split(':')
		userService.authenticate({userID, password}, (err, result) => {
			if(err){
				res.status(500)
				res.send({"Error": "internal error in userService.authenticate(): " + err})
			} else if(!result){
				res.status(401)
				res.send({"Error": "invalid authentication credentials"})
			} else if(result){
				res.status(200)
				res.send({"Message": "user authenticated"})
			}
		})
	}
})

module.exports = router