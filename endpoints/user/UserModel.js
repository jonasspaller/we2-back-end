var mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	userID: {
		type: String,
		unique: true,
		required: true
	},
	userName: String,
	password: String,
	isAdministrator: {
		type: Boolean,
		default: false
	}
}, { timestamps: true }
)

UserSchema.pre('save', function (next) {
	var user = this
	if (!user.isModified('password')) { return next() }
	bcrypt.hash(user.password, 10).then((hasedPassword) => {
		user.password = hasedPassword
		next()
	})
}, function (err) {
	next(err)
})

UserSchema.methods.comparePassword = function (candidatePassword, next) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err){
			return next(err)
		} else {
			next(null, isMatch)
		}
	})
}

const User = mongoose.model("User", UserSchema)
module.exports = User;