const mongoose = require('mongoose')

const ForumMessageSchema = new mongoose.Schema({
	forumThreadID: {
		type: String,
		required: true
	},
	title: String,
	text: String,
	authorID: {
		type: String,
		required: true
	}
}, { timestamps: true })

module.exports = mongoose.model("ForumMessage", ForumMessageSchema)