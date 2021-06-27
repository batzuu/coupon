const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
	// user schema
	firstName: {type: String, trim: true},
	lastName: {type: String, trim: true},
	classYear: Number,
	email: {type: String, unique: true, sparse: true, trim: true},
	phone: {type: String, unique: true, sparse: true},
	phoneProvider: {type: String, trim: true},
	isAdmin: {type: Boolean, index: true},
	isSuperAdmin: {type: Boolean, index: true},
	hash: String,
	companyName: {type: String, trim: true},
	interests: [String],
	token: String,
},
{
	toObject: {getters: true},
	timestamps: {
		createdAt: 'createdDate',
		updatedAt: 'updatedDate'
	}
});

// example where arrow function should not be used
// 'this' does not work with block scope that arrow funtion provides
userSchema.pre('save', function(callback) {
	if (this.isAdmin || this.isSuperAdmin) {
		if (!this.email)
			return callback(new Error('Missing email'));
		if (!this.hash)
			return callback(new Error('Missing password'));
		if (!this.companyName)
			return callback(new Error('Missing companyName'));

		// TODO hash
	}

	else {
		console.log("Yesy");
		console.log(this.phone);
		if (!this.phone)
			return callback(new Error('Missing phonee'));
		if (!this.phoneProvider)
			return callback(new Error('Missing phoneProvider'));
	}

	// validate phone
	if (this.phone) {
		if (typeof this.phone !== 'string')
			return callback(new Error('Invalid phone'));
		var phone = '';
		for (var i = 0; i < this.phone.length; i++) {
			if (!isNaN(this.phone[i]))
				phone += this.phone[i];
		}
		if (phone.length !== 10)
			return callback(new Error('Invalid phone'));
		this.phone = phone;
	}

	callback();
});

// creating methods
userSchema.methods.greet = () => {
	console.log('hi!');
};

userSchema.virtual('name').get(function() {
	var name = "";
	if (this.firstName) {
		name = this.firstName;
		if (this.lastName) name += ' ' + this.lastName;
	} else if (this.lastName) name = this.lastName;
	return name;
});

// method to check hashed pass
userSchema.methods.checkPassword = function (hashedPassword) {
	return (this.hash === hashedPassword);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
