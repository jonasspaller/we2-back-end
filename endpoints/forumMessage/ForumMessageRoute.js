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
				res.json({"Error": "An error occured while trying to get ForumMessages: " + err})
			} else if(!thread){
				res.status(400)
				res.json({"Error": "No thread found with id " + forumThreadID})
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
				res.json({"Error": "An error occured while trying to get ForumMessages: " + err})
			} else {
				res.status(200)
				res.json(messages)
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
			res.json({"Error": "An error occured while trying to save ForumMessage: " + err})
		} else if(!savedMessage){
			res.status(400)
			res.json({"Error": "Could not find ForumThread with id " + req.body.forumThreadID})
		} else if(savedMessage){
			res.status(201)
			res.json(savedMessage)
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
			res.json({"Error": "An error occured while trying to update ForumMessage with id " + messageID + ": " + err})
		} else {
			if(updatedMessage){
				if(ownerCorrect){
					res.status(200)
					res.json(updatedMessage)
				} else {
					res.status(401)
					res.json({"Error": "you are not the owner of this message"})
				}
			} else {
				res.status(404)
				res.json({"Error": "Could not find ForumMessage with id " + messageID})
			}
		}
	})
})

// delete forumMessage (only if logged in  user is the owner)
router.delete('/:messageID', authenticationService.isAuthenticated, (req, res) => {
	const messageID = req.params.messageID
	const askingUser = res.locals.user
	forumMessageService.deleteForumMessage(messageID, askingUser, (err, deletedMessage, ownerCorrect) => {
		if(err){
			res.status(500)
			res.json({"Error": "An error occured while trying to delete ForumMessage with id " + messageID + ": " + err})
		} else {
			if(deletedMessage){
				if(ownerCorrect){
					res.status(204)
					res.json(deletedMessage)
				} else {
					res.status(401)
					res.json({"Error": "you are not the owner of this message"})
				}
			} else {
				res.status(404)
				res.json({"Error": "Could not find ForumMessage with id " + messageID})
			}
		}
	})
})

module.exports = router