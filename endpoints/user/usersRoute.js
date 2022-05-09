var express = require('express')
var router = express.Router()
var userService = require("./UserService")
var authenticationService = require('../../utils/AuthenticationUtils')

// register middleware
router.use(authenticationService.isAuthenticated)
router.use(authenticationService.isAdmin)

// GET requests
router.get('/', (req, res, next) => {
	userService.getUsers((err, result) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to get users: " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find users"})
		} else {
			var helperArray = []
			result.map((element) => {
				const {userID, userName, isAdministrator, ...partialObject} = element
				const subset = {userID, userName, isAdministrator}
				helperArray.push(subset)
			})

			res.status(200)
			res.send(helperArray)
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
			const {userID, userName, isAdministrator, ...partialObject} = result
			const subset = {userID, userName, isAdministrator}
			res.status(200)
			res.send(subset)
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
				const {userID, userName, isAdministrator, ...partialObject} = result
				const subset = {userID, userName, isAdministrator}
				res.status(201)
				res.send(subset)
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
			const {userID, userName, isAdministrator, ...partialObject} = result
			const subset = {userID, userName, isAdministrator}
			res.status(200)
			res.send(subset)
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
			const {userID, userName, isAdministrator, ...partialObject} = result
			const subset = {userID, userName, isAdministrator}
			res.status(204)
			res.send(subset)
		}
	})
})

module.exports = router