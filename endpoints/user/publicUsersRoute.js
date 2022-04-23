var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var userService = require("./UserService");

var jsonParser = bodyParser.json();

// GET requests
router.get('/', (req, res) => {
	userService.getUsers((err, result) => {
		console.log("Result: " + result);
		if(result){
			res.send(Object.values(result));
		} else {
			res.send("Es gab Probleme.");
		}
	});
});

router.get('/:searchedUser', jsonParser, (req, res) => {
	userService.getOneUser(req.params.searchedUser, (err, result) => {
		if(result){
			res.json(result);
		} else {
			res.send(err);
		}
	});
});

// POST requests
router.post('/', jsonParser, (req, res) => {

	userService.saveUser(req.body, (err) => {

		if(!err){
			res.send("Erfolgreich gespeichert");
		} else {
			res.send("Fehler: " + err);
		}

	});

});

// PUT requests
router.put('/:userToUpdate', jsonParser, (req, res) => {

	let userToUpdate = req.params.userToUpdate;

	userService.updateUser(userToUpdate, req.body, (err) => {
		if(!err){
			res.send("User " + userToUpdate + " sucessfully updated");
		} else {
			res.send("An error occured while trying to update " + userToUpdate);
			console.log(err);
		}
	});
});

module.exports = router;