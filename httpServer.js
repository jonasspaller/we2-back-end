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
const UserService = require('./endpoints/users/UserService')
UserService.checkDefaultAdmin()

// define source files for routes
const publicUsersRoute = require('./endpoints/users/publicUsersRoute')
const usersRoute = require('./endpoints/users/usersRoute')
const authenticateRoute = require('./endpoints/authentication/AuthenticateRoute')

// define routes
app.use('/publicUsers', publicUsersRoute)
app.use('/users', usersRoute)
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