const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./task");
require("dotenv").config({
	path: "./config/dev.env",
});
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter name"],
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: [true, "Please enter an email"],
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Not a valid email");
				}
			},
		},
		password: {
			type: String,
			require: [true, "Please enter the password"],
			trim: true,
			minlength: [5, "Min length is 5"],
			validate(value) {
				if (value.toLowerCase().includes("password")) {
					throw new Error("Cant contain password");
				}
			},
		},
		age: {
			type: Number,
			// required:true,
			default: 0,
			validate(value) {
				if (value < 0) {
					throw new Error("Age must be positive");
				}
			},
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
	},
	{
		timestamps: true,
	}
);
// userSchema.methods.toJSON=async function(){
//     const user=this
//     const userObject=user.toObject()
//     delete userObject.password
//     delete userObject.tokens
//     delete userObject.avatar
//     return userObject
// }

userSchema.virtual("tasks", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
	try {
		const user = this;
		const token = jwt.sign(
			{ _id: user._id.toString() },
			process.env.JWT_SECRET,
			{ expiresIn: "7 days" }
		);
		user.tokens = user.tokens.concat({ token: token });
		await user.save();
		return token;
	} catch (e) {
		console.log(`Cant create token ${e}`);
	}
};

userSchema.statics.findByCredentials = async (email, password) => {
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			throw new Error("No such user");
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new Error("Wrong Password");
		}
		return user;
	} catch (e) {
		console.log("Cant login ", e);
	}
};

//Schema for saving
userSchema.pre("save", async function (next) {
	try {
		const user = this;
		if (user.isModified("password")) {
			user.password = await bcrypt.hash(user.password, 10);
		}
		next();
	} catch (e) {
		console.log("Error from the pre userschema of save in models");
	}
});

//Deleting the data of the user that we want to delete

userSchema.pre("remove", async function (next) {
	try {
		const user = this;
		await Tasks.deleteMany({ owner: user._id });
		next();
	} catch (e) {
		console.log("Error from the pre userschema of remove in models");
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
