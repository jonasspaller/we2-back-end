// express setup
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8080
app.use(bodyParser.json())

// initialise db connection
const database = require('./database/db')
database.initDB((err, db) => {
	if(db) console.log("database connection established")
})

// check if default admin already exists
const UserService = require('./endpoints/user/UserService')
UserService.checkDefaultAdmin()

// define source files for routes
const publicUsersRoute = require('./endpoints/user/publicUsersRoute')
const authenticateRoute = require('./endpoints/authenticate/authenticateRoute')

// define routes
app.use('/publicUsers', publicUsersRoute)
app.use('/authenticate', authenticateRoute)

// error message for non-existing endpoints
app.all('/*', (req, res, next) => {
	res.status(404)
	res.json({"Error": "The requested endpoint does not exist"})
})

// start webserver
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})