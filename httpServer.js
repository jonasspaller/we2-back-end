const express = require('express')
const database = require('./database/db')
const app = express()
const port = 8080

// initialise db connection
database.initDB((err, db) => {
	if(db) console.log("database connection established")
})

// define source files for routes
const publicUsersRoute = require('./endpoints/user/publicUsersRoute')

// define which route uses which source file
app.use('/publicUsers', publicUsersRoute)

// start webserver
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})