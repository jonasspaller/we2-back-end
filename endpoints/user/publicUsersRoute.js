var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var userService = require("./UserService");

var jsonParser = bodyParser.json();

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

router.post('/', jsonParser, (req, res) => {

	userService.saveUser(req.body, (err) => {

		if(!err){
			res.send("Erfolgreich gespeichert");
		} else {
			res.send("Fehler: " + err);
		}

	});

});

module.exports = router;