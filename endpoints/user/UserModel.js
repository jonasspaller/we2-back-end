var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	id: Number,
	userID: {
		type: String,
		unique: true
	},
	email: String,
	password: String,
	image: String,
	isAdministrator: {
		type: Boolean,
		default: false
	}
}, { timestamps: true }
);