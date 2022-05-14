const express = require('express')
const router = express.Router()
const forumMessageService = require('./ForumMessageService')
const authenticationService = require('../../utils/AuthenticationUtils')

// read all forumMessages
router.get('/', (req, res) => {
	// check if URI param forumThreadID is set
	const forumThreadID = req.query.forumThreadID
	if(forumThreadID){
		forumMessageService.getAllForumMessagesByThreadID(forumThreadID, (err, thread, messages) => {
			if(err){
				res.status(500)
				res.send({"Error": "An error occured while trying to get ForumMessages: " + err})
			} else if(!thread){
				res.status(404)
				res.json({"Message": "No thread found with id " + forumThreadID})
			} else if(thread){
				if(!messages){
					res.status(404)
					res.json({"Message": "No messages found in thread with id " + forumThreadID})
				} else {
					res.status(200)
					res.json(messages)
				}
			}
		})
	} else {
		// get all forumMessages from everybody
		forumMessageService.getAllForumMessages((err, messages) => {
			if(err){
				res.status(500)
				res.send({"Error": "An error occured while trying to get ForumMessages: " + err})
			} else {
				res.status(200)
				res.send(messages)
			}
		})
	}
})

// create new forumMessage
router.post('/', authenticationService.isAuthenticated, (req, res) => {
	const authorID = res.locals.user.userID
	forumMessageService.saveForumMessage(authorID, req.body, (err, savedMessage) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to save ForumMessage: " + err})
		} else if(!savedMessage){
			res.status(404)
			res.json({"Message": "Could not find ForumThread with id " + req.body.forumThreadID})
		} else if(savedMessage){
			res.status(201)
			res.send(savedMessage)
		}
	})
})

// update forumMessage (only if logged in  user is the owner)
router.put('/:messageID', authenticationService.isAuthenticated, (req, res) => {
	const messageID = req.params.messageID
	const askingUser = res.locals.user
	forumMessageService.updateForumMessage(messageID, req.body, askingUser, (err, updatedMessage, ownerCorrect) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to update ForumMessage with id " + messageID + ": " + err})
		} else {
			if(updatedMessage){
				if(ownerCorrect){
					res.status(200)
					res.send(updatedMessage)
				} else {
					res.status(401)
					res.send({"Error": "you are not the owner of this message"})
				}
			} else {
				res.status(404)
				res.send({"Error": "Could not find ForumMessage with id " + messageID})
			}
		}
	})
})



/***

// read single forumThread
router.get('/:threadID', (req, res) => {
	const threadID = req.params.threadID
	forumThreadService.getForumThreadByID(threadID, (err, thread) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to get ForumThread with id" + threadID + ": " + err})
		} else if(!thread){
			res.status(404)
			res.send({"Error": "Could not find ForumThread with id " + threadID})
		} else {
			res.status(200)
			res.send(thread)
		}
	})
})

// read all forumThreads from logged in user (get userID from token)
myForumThreadsRouter.get('/', authenticationService.isAuthenticated, (req, res) => {
	const userID = res.locals.user.userID
	forumThreadService.getAllForumThreadsByOwnerID(userID, (err, threads) => {
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
})





// delete forumThread (only if logged in  user is the owner)
router.delete('/:threadID', authenticationService.isAuthenticated, (req, res) => {
	const threadID = req.params.threadID
	const askingUser = res.locals.user
	forumThreadService.deleteForumThread(threadID, askingUser, (err, deletedThread, ownerCorrect) => {
		if(err){
			res.status(500)
			res.send({"Error": "An error occured while trying to delete ForumThread with id " + threadID + ": " + err})
		} else {
			if(deletedThread){
				if(ownerCorrect){
					res.status(204)
					res.send(deletedThread)
				} else {
					res.status(401)
					res.json({"Error": "you are not the owner of this thread"})
				}
			} else {
				res.status(404)
				res.send({"Error": "Could not find ForumThread with id " + threadID})
			}
		}
	})
})


*/

module.exports = router