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
const publicUsersRoutes = require('./endpoints/user/publicUsersRoute')
const usersRoutes = require('./endpoints/user/usersRoute')
const authenticateRoutes = require('./endpoints/authentication/AuthenticateRoute')
const forumThreadRoutes = require('./endpoints/forumThread/ForumThreadRoute')
const forumMessagesRoute = require('./endpoints/forumMessage/ForumMessageRoute')

// define routes
app.use('/publicUsers', publicUsersRoutes)
app.use('/users', usersRoutes)
app.use('/authenticate', authenticateRoutes)
app.use('/forumThreads', forumThreadRoutes)
app.use('/forumMessages', forumMessagesRoute)

// error message for non-existing endpoints
app.all('/*', (req, res, next) => {
	res.status(404)
	res.json({"Error": "The requested endpoint does not exist"})
})

// start webserver
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})