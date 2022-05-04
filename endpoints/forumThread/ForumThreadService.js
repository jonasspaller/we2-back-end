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
function getAllForumThreadsByUserID(userID, callback){
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

module.exports = {
	getAllForumThreads,
	getAllForumThreadsByUserID
}