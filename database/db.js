const assert = require('assert');
var mongoose = require('mongoose');
const config = require('config');

let _db;

const connectionString = config.get('db.connectionString');

function initDB(callback) {

	if(_db){
		if(callback){
			return callback(null, _db);
		} else {
			return _db;
		}
	} else {

		mongoose.connect(connectionString, { useNewUrlParser: true, useUnfifiedTopology: true, userCreateIndex: true });
		_db = mongoose.connection;

		_db.on('error', console.error.bind(console, "connection error: "));
		_db.once('open', () => {
			console.log("Connected to Database " + connectionString + " in DB.js: " + _db);
			callback(null, _db);
		});

	}

}