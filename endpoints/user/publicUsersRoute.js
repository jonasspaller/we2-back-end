var express = require('express')
var router = express.Router()
var userService = require("./UserService")

// GET requests
router.get('/', (req, res) => {
	userService.getUsers((err, result) => {
		if(err){
			res.status(500)
			res.json({"Error": "An error occured while trying to get users: " + err})
		} else if(!result){
			res.status(404)
			res.json({"Error": "Could not find users"})
		} else {
			res.status(200)
			res.json(result)
		}
	})
})

router.get('/:username', (req, res) => {
	let username = req.params.username
	userService.getUserByID(username, (err, result) => {
		if(err){
			res.status(500)
			res.json({"Error": "An error occured while trying to get user " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.json({"Error": "Could not find user " + username})
		} else {
			res.status(200)
			res.json(result)
		}
	})
})

// POST requests
router.post('/', (req, res) => {
	let newUserID = req.body.userID
	if(newUserID == undefined || newUserID == null){
		res.status(400)
		res.json({"Error": "cannot set a new user without userID"})
	} else {
		userService.saveUser(newUserID, req.body, (err, result) => {
			if(err){
				res.status(500)
				res.json({"Error": "An error occured while trying to save user " + newUserID + ": " + err})
			} else if(!result){
				res.status(400)
				res.json({"Error": "User " + newUserID + " already exists"})
			} else {
				res.status(201)
				res.json(result)
			}
		})
	}
})

// PUT requests
router.put('/:username', (req, res) => {
	let username = req.params.username
	userService.updateUser(username, req.body, (err, result) => {
		if(err){
			res.status(500)
			res.json({"Error": "An error occured while trying to update " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.json({"Error": "Could not find user " + username})
		} else {
			res.status(200)
			res.json(result)
		}
	})
})

// DELETE requests
router.delete('/:username', (req, res) => {
	let username = req.params.username
	userService.deleteUser(username, (err, result) => {
		if(err){
			res.status(500)
			res.json({"Error": "An error occured while trying to delete " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.json({"Error": "Could not find user " + username})
		} else {
			res.status(204)
			res.json(result)
		}
	})
})

module.exports = router