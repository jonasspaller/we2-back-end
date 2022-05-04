var express = require('express')
var router = express.Router()
var forumThreadService = require('./ForumThreadService')
var authenticationService = require('../authentication/AuthenticationService')

// read all forumThreads
router.get('/', (req, res) => {
	// check if URI param ownerID is set
	const ownerID = req.query.ownerID
	if(ownerID){
		// get all forumThreads from just this user
		forumThreadService.getAllForumThreadsByUserID(ownerID, (err, threads) => {
			if(err){
				res.status(500)
				res.send({"Error": "An error occured while trying to get ForumThreads: " + err})
			} else if(!threads){
				res.status(404)
				res.send({"Error": "Could not find ForumThreads"})
			} else {
				res.status(200)
				res.send(threads)
			}
		})
	} else {
		// get all forumThreads from everybody
		forumThreadService.getAllForumThreads((err, threads) => {
			if(err){
				res.status(500)
				res.send({"Error": "An error occured while trying to get ForumThreads: " + err})
			} else if(!threads){
				res.status(404)
				res.send({"Error": "Could not find ForumThreads"})
			} else {
				res.status(200)
				res.send(threads)
			}
		})
	}
})

// read single forumThread
router.get('/:threadID', (req, res) => {

})

// read all forumThreads from logged in user (get userID from token)
router.get('/myForumThreads', authenticationService.isAuthenticated, (req, res) => {

})

// create new forumThread
router.post('/', authenticationService.isAuthenticated, (req, res) => {

})

// update forumThread
router.put('/:threadID', authenticationService.isAuthenticated, (req, res) => {

})

// delete forumThread
router.delete('/:threadID', authenticationService.isAuthenticated, (req, res) => {

})

module.exports = router