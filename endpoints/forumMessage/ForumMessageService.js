const ForumMessage = require('./ForumMessageModel')
const forumThreadService = require('../forumThread/ForumThreadService')

// get all ForumMessages from database
function getAllForumMessages(callback){
	ForumMessage.find((err, messages) => {
		if(err){
			callback(err)
		} else {
			callback(null, messages)
		}
	})
}

// get single ForumMessage by its id
function getForumMessageByID(messageID, callback){
	ForumMessage.findById(messageID, (err, message) => {
		if(err){
			callback(err)
		} else if(!message){
			callback(null, null)
		} else if(message){
			callback(null, message)
		}
	})
}

// get all forumMessages from one specific thread
function getAllForumMessagesByThreadID(threadID, callback){
	// check if thread even exists
	forumThreadService.getForumThreadByID(threadID, (err, thread) => {
		if(err){
			callback("Error in getForumThreadByID(): " + err)
		} else if(!thread){
			callback(null, null, null)
		} else if(thread){
			// found thread, get messages
			ForumMessage.find({forumThreadID: threadID}, (err, messages) => {
				if(err){
					callback(err)
				} else if(!messages){
					callback(null, thread, null)
				} else if(messages){
					callback(null, thread, messages)
				}
			})
		}
	})
	
}

// save new ForumMessage to database
function saveForumMessage(authorID, reqBody, callback) {
	// search for forumThread
	forumThreadService.getForumThreadByID(reqBody.forumThreadID, (err, thread) => {
		if(err){
			callback(err)
		} else if (!thread){
			callback(null, null)
		} else if(thread){
			// thread found, save message
			const newForumMessage = new ForumMessage(reqBody)
			newForumMessage.authorID = authorID
			newForumMessage.save()
			.then((savedMessage) => {
				callback(null, savedMessage)
			})
			.catch((saveError) => {
				callback(saveError)
			})
		}
	})
}

// update ForumMessage in database
function updateForumMessage(messageID, updateBody, askingUser, callback){
	// get ForumMessage document from db
	getForumMessageByID(messageID, (err, message) => {
		if(err){
			callback("Error in getForumMessageByID(): " + err)
		} else if(!message){
			callback(null, null, null)
		} else if(message){
			// found message, check if asking user is the owner or admin
			if(askingUser.userID === message.authorID || askingUser.isAdministrator){
				Object.assign(message, updateBody)

				message.save()
				.then((savedMessage) => {
					callback(null, savedMessage, true)
				})
				.catch((saveError) => {
					callback(saveError)
				})
			} else {
				// message found, but no permission
				callback(null, Object, false)
			}
		}
	})
}

// delete ForumMessage from database
function deleteForumMessage(messageID, askingUser, callback){
	// get ForumMessage document from db
	getForumMessageByID(messageID, (err, message) => {
		if(err){
			callback("Error in getForumMessageByID(): " + err)
		} else if(!message){
			callback(null, null, null)
		} else if(message){
			// found message, check if asking user is the owner or admin
			if(askingUser.userID === message.authorID || askingUser.isAdministrator){
				ForumMessage.deleteOne({_id: messageID})
				.then((deletedMessage) => {
					callback(null, deletedMessage, true)
				})
				.catch((deleteError) => {
					callback(deleteError)
				})
			} else {
				// message found, but no permission
				callback(null, Object, false)
			}
		}
	})
}

module.exports = {
	getAllForumMessages,
	getForumMessageByID,
	getAllForumMessagesByThreadID,
	saveForumMessage,
	updateForumMessage,
	deleteForumMessage
}