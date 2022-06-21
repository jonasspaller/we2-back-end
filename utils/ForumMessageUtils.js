const ForumMessage = require('../endpoints/forumMessage/ForumMessageModel')

// helper function for deleting all messages when a ForumThread is deleted
function deleteAllMessagesFromThread(threadID, callback){
	if(threadID){
		ForumMessage.deleteMany({forumThreadID: threadID})
		.then(() => {
			callback()
		})
		.catch((deleteError) => {
			callback(deleteError)
		})
	}
}

module.exports = {
	deleteAllMessagesFromThread
}