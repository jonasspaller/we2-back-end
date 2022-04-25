var mongoose = require('mongoose')
const config = require('config')

let _db

const connectionString = config.get('db.connectionString')
const connectionOptions = config.get('db.dbConfigOptions')

function initDB(callback) {

	if(_db){
		if(callback){
			return callback(null, _db)
		} else {
			return _db
		}
	} else {
		mongoose.connect(
			connectionString,
			connectionOptions
		).then(() => {
			// success
			console.log("Connected to database " + connectionString)
			callback(null, _db)
		}).catch((err) => {
			// failure
			console.error("Failed to connect to database " + connectionString)
			console.error(err)
		})
		_db = mongoose.connection
	}

}

function close() {
	mongoose.connection.close()
}

module.exports = {
	initDB,
	close
}