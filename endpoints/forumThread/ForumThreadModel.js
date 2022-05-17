const mongoose = require('mongoose')

const ForumThreadSchema = new mongoose.Schema({
	name: String,
	description: String,
	ownerID: {
		type: String,
		required: true
	}
}, { timestamps: true })

module.exports = mongoose.model("ForumThread", ForumThreadSchema)