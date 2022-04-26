var express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()
var userService = require("./UserService")

// helper for sending responses
function handleResponse(res, err, status, result){
	if(err){
		res.status(status)
		res.json(err)
	} else {
		res.status(status)
		res.json(result)
	}
}

// GET requests
router.get('/', (req, res) => {
	userService.getUsers((err, result) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to get users: " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find users"})
		} else {
			res.status(200)
			res.send(result)
		}
	})
})

router.get('/:username', (req, res) => {
	let username = req.params.username
	userService.getUserByID(username, (err, result) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to get user " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find user " + username})
		} else {
			res.status(200)
			res.send(result)
		}
	})
})

// POST requests
router.post('/', (req, res) => {
	let newUserID = req.body.userID
	if(newUserID == undefined || newUserID == null){
		res.status(400)
		res.send({"Error": "cannot set a new user without userID"})
	} else {
		userService.saveUser(newUserID, req.body, (err, result) => {
			if(err){
				res.status(500)
				res.send({"Error": "An error occured while trying to save user " + newUserID + ": " + err})
			} else if(!result){
				res.status(400)
				res.send({"Error": "User " + newUserID + " already exists"})
			} else {
				res.status(201)
				res.send(result)
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
			res.send({"Error": "An error occured while trying to update " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find user " + username})
		} else {
			res.status(200)
			res.send(result)
		}
	})
})

// DELETE requests
router.delete('/:username', (req, res) => {
	let username = req.params.username
	userService.deleteUser(username, (err, result) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to delete " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find user " + username})
		} else {
			res.status(204)
			res.send(result)
		}
	})
})

module.exports = router