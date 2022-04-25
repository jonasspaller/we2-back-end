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
		} else if(err){
			res.status(500)
			res.json(err)
		}
	})
})

router.get('/:username', (req, res) => {
	let username = req.params.username
	userService.getUserByID(username, (err, result) => {
		if(result){
			res.json(result)
		} else if(err){
			res.status(404)
			res.json(err)
		}
	})
})

// POST requests
router.post('/', jsonParser, (req, res) => {
	userService.saveUser(req.body, (err, result) => {
		if(result){
			res.status(201)
			res.json(result)
		} else if(err){
			res.status(400)
			res.json(err)
		}
	})
})

// PUT requests
router.put('/:username', jsonParser, (req, res) => {
	let username = req.params.username
	userService.updateUser(username, req.body, (err, result) => {
		if(result){
			res.json(result)
		} else if(err){
			res.status(400)
			res.json(err)
		}
	})
})

// DELETE requests
router.delete('/:username', (req, res) => {
	let username = req.params.username
	userService.deleteUser(username, (err, result) => {
		if(result){
			res.status(204)
		} else if(err){
			res.status(400)
			res.json(err)
		}
	})
})

module.exports = router