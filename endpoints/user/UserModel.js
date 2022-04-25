var mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	id: Number,
	userID: {
		type: String,
		unique: true
	},
	userName: String,
	isAdministrator: {
		type: Boolean,
		default: false
	},
	password: String
}, { timestamps: true }
)

module.exports = UserSchema