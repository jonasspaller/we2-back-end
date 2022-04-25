var express = require('express')
var router = express.Router()

var userService = require("./UserService")

router.get('/', (req, res, next) => {
	userService.getUsers((err, result) => {
		console.log("Result: " + result)
		if(result){
			res.send(Object.values(result))
		} else {
			res.send("Es gab Probleme.")
		}
	})
})

module.exports = router