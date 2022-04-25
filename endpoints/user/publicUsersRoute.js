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
	userService.getUsers((err, status, result) => {
		handleResponse(res, err, status, result)
	})
})

router.get('/:username', (req, res) => {
	let username = req.params.username
	userService.getUserByID(username, (err, status, result) => {
		handleResponse(res, err, status, result)
	})
})

// POST requests
router.post('/', jsonParser, (req, res) => {
	userService.saveUser(req.body, (err, status, result) => {
		handleResponse(res, err, status, result)
	})
})

// PUT requests
router.put('/:username', jsonParser, (req, res) => {
	let username = req.params.username
	userService.updateUser(username, req.body, (err, status, result) => {
		handleResponse(res, err, status, result)
	})
})

// DELETE requests
router.delete('/:username', (req, res) => {
	let username = req.params.username
	userService.deleteUser(username, (err, status, result) => {
		handleResponse(res, err, status, result)
	})
})

module.exports = router