const mongoose = require("mongoose");
const bcryptjs = require('bcryptjs');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
		  name: String,
		  email: String,
		  password: String,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

/*
const Model = {
		name : {
				type : "String"
				, required : true
		} 
		, email : {
				type : "String"
				, required : true
		} 
		, password : {
				type : "String"
				, required : true
		} 
};

const Schema = new mongoose.Schema( Model,  { timestamps: true } );

module.exports = { Schema: mongoose.model("User", Schema), Model };
*/
module.exports.createUser = (newUser, callback) => {
		bcryptjs.genSalt(10, (err, salt) => {
				bcryptjs.hash(newUser.password, salt, (error, hash) => {
						const newUserResource = newUser;
						newUserResource.password = hash;
						newUserResource.save(callback);
				});
		});
};

module.exports.getUserByEmail = (email, callback) => {
		const query = { email };
		User.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
		bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
				if (err) throw err;
				callback(null, isMatch);
		});
};
