const ForumThread = require('./ForumThreadModel')

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
function getAllForumThreadsByFilter(filter, callback){
	ForumThread.find(filter, (err, threads) => {
		if(err){
			callback(err, null)
		} else if(!threads){
			callback(null, null)
		} else if(threads){
			callback(null, threads)
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

// delete ForumThread from database
function deleteForumThread(threadID, callback){
	// get ForumThread document from db
	getAllForumThreadsByFilter({_id: threadID}, (err, thread) => {
		if(err){
			callback("Error in getAllForumThreadsByFilter(): " + err)
		} else if(!thread){
			callback(null, null)
		} else if(thread){
			ForumThread.deleteOne({_id: threadID})
			.then((deletedThread) => {
				callback(null, deletedThread)
			})
			.catch((deleteError) => {
				callback(deleteError)
			})
		}
	})
}

module.exports = {
	getAllForumThreads,
	getAllForumThreadsByFilter,
	saveForumThread,
	deleteForumThread
}