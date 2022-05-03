var express = require('express')
var router = express.Router()
var userService = require("./UserService")

const jwt = require('jsonwebtoken')
const config = require('config')

const jwtKey = config.get('session.tokenKey')

// check authorization
function isAuthenticated(req, res, next){
	if(typeof req.headers.authorization !== "undefined"){
		let token = req.headers.authorization.split(" ")[1]
		jwt.verify(token, jwtKey, {algorithm: "HS256"}, (err, user) => {
			if(err){
				// error happened
				res.status(500)
				res.send({"Error": "error while checking token: " + err})
			} else if(!user){
				// key invalid
			} else if(user){
				// key valid, only proceed if user is admin
				if(user.isAdministrator){
					return next()
				} else {
					res.status(401)
					res.send({"Error": "user is no admin"})
				}
			}
		})
	} else {
		res.status(401)
		res.send({"Error": "Not authorized"})
	}
}

// GET requests
router.get('/', isAuthenticated, (req, res, next) => {
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
				const {userID, userName, ...partialObject} = element
				const subset = {userID, userName}
				helperArray.push(subset)
			})

			res.status(200)
			res.send(helperArray)
		}
	})
})

router.get('/:username', isAuthenticated, (req, res) => {
	let username = req.params.username
	userService.getUserByID(username, (err, result) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to get user " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find user " + username})
		} else {
			const {userID, userName, ...partialObject} = result
			const subset = {userID, userName}
			res.status(200)
			res.send(subset)
		}
	})
})

// POST requests
router.post('/', isAuthenticated, (req, res) => {
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
				const {userID, userName, ...partialObject} = result
				const subset = {userID, userName}
				res.status(201)
				res.send(subset)
			}
		})
	}
})

// PUT requests
router.put('/:username', isAuthenticated, (req, res) => {
	let username = req.params.username
	userService.updateUser(username, req.body, (err, result) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to update " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find user " + username})
		} else {
			const {userID, userName, ...partialObject} = result
			const subset = {userID, userName}
			res.status(200)
			res.send(subset)
		}
	})
})

// DELETE requests
router.delete('/:username', isAuthenticated, (req, res) => {
	let username = req.params.username
	userService.deleteUser(username, (err, result) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to delete " + username + ": " + err})
		} else if(!result){
			res.status(404)
			res.send({"Error": "Could not find user " + username})
		} else {
			const {userID, userName, ...partialObject} = result
			const subset = {userID, userName}
			res.status(204)
			res.send(subset)
		}
	})
})

module.exports = router