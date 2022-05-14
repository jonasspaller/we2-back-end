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

module.exports = {
	getAllForumMessages,
	saveForumMessage
}




/**
 * 
 * 
 * const ForumThread = require('./ForumThreadModel')

// get all forumThreads from database
function getAllForumThreads(callback){
	ForumThread.find((err, threads) => {
		if(err){
			callback(err, null)
		} else if(!threads){
			callback(null, null)
		} else if(threads){
			callback(null, threads)
		}
	})
}

// get all forumThreads from one specific user
function getAllForumThreadsByOwnerID(userID, callback){
	ForumThread.find({ownerID: userID}, (err, threads) => {
		if(err){
			callback(err, null)
		} else if(!threads){
			callback(null, null)
		} else if(threads){
			callback(null, threads)
		}
	})
}

// get single ForumThread by its id
function getForumThreadByID(threadID, callback){
	ForumThread.findById(threadID, (err, thread) => {
		if(err){
			callback(err)
		} else if(!thread){
			callback(null, null)
		} else if(thread){
			callback(null, thread)
		}
	})
}

// save new ForumThread to database
function saveForumThread(ownerID, reqBody, callback) {
	const newThread = new ForumThread(reqBody)
	newThread.ownerID = ownerID
	newThread.save()
	.then((savedThread) => {
		callback(null, savedThread)
	})
	.catch((saveError) => {
		callback(saveError)
	})
}

// update ForumThread in database
function updateForumThread(threadID, updateBody, askingUser, callback){
	// get ForumThread document from db
	getForumThreadByID(threadID, (err, thread) => {
		if(err){
			callback("Error in getForumThreadByID(): " + err)
		} else if(!thread){
			callback(null, null, null)
		} else if(thread){
			// found thread, check if asking user is the owner or admin
			if(askingUser.userID === thread.ownerID || askingUser.isAdministrator){
				Object.assign(thread, updateBody)

				thread.save()
				.then((savedThread) => {
					callback(null, savedThread, true)
				})
				.catch((saveError) => {
					callback(saveError)
				})
			} else {
				callback(null, Object, false)
			}
		}
	})
}

// delete ForumThread from database
function deleteForumThread(threadID, askingUser, callback){
	// get ForumThread document from db
	getForumThreadByID(threadID, (err, thread) => {
		if(err){
			callback("Error in getForumThreadByID(): " + err)
		} else if(!thread){
			callback(null, null, null)
		} else if(thread){
			// found thread, check if asking user is the owner or admin
			if(askingUser.userID === thread.ownerID || askingUser.isAdministrator){
				ForumThread.deleteOne({_id: threadID})
				.then((deletedThread) => {
					callback(null, deletedThread, true)
				})
				.catch((deleteError) => {
					callback(deleteError)
				})
			} else {
				// thread found, but no permission
				callback(null, Object, false)
			}
		}
	})
}

module.exports = {
	getAllForumThreads,
	getAllForumThreadsByOwnerID,
	getForumThreadByID,
	saveForumThread,
	updateForumThread,
	deleteForumThread
}
 */