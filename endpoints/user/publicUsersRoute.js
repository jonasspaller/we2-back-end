var express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()
var userService = require("./UserService")

// GET requests
router.get('/', (req, res) => {
	userService.getUsers((err, result) => {
		if(result){
			res.send(Object.values(result))
		} else {
			res.status(500)
			res.send("An error occured while trying to get users: " + err)
		}
	})
})

router.get('/:username', (req, res) => {
	let username = req.params.username
	userService.getOneUser(username, (err, result) => {
		if(result){
			res.json(result)
		} else {
			res.status(500)
			res.send("An error occured while trying to get user " + username + ": " + err)
		}
	})
})

// POST requests
router.post('/', jsonParser, (req, res) => {
	userService.saveUser(req.body, (err, result) => {
		if(result){
			res.send("Erfolgreich gespeichert")
		} else {
			res.status(500)
			res.send("An error occured while trying to save user " + req.body.userID + ": " + err)
		}
	})
})

// PUT requests
router.put('/:username', jsonParser, (req, res) => {
	let username = req.params.username
	userService.updateUser(username, req.body, (err, result) => {
		if(result){
			res.send("User " + username + " sucessfully updated")
		} else {
			res.status(500)
			res.send("An error occured while trying to update " + userToUpdate + ": " + err)
		}
	})
})

// DELETE requests
router.delete('/:username', (req, res) => {
	let username = req.params.username
	userService.deleteUser(username, (err, user) => {
		if(user){
			res.send("User " + user + " deleted successfully")
		} else if (err){
			res.status(500)
			res.send("An error occured while trying to delete " + username + ": " + err)
		}
	})
})

module.exports = router