const express = require("express");
const User = require("../models/user");
const sharp = require("sharp");
const moment = require("moment");
const multer = require("multer");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");
const Tasks = require("../models/task");
const { checkUser, auth } = require("../middleware/auth");

const router = new express.Router();

const maxAge = 3 * 24 * 60 * 60;

const errorHandler = (e) => {
	console.log(e.message, e.code);
	let errors = { email: "", password: "" };
	if (e.code === 11000) {
		errors.email = "this email is already registered";
		return errors;
	}
	if (e.message.includes("user validation failed")) {
		Object.values(e.errors).forEach(({ properties }) => {
			error[properties.path] = properties.message;
		});
	}
	return errors;
};

router.get("*", checkUser);

router.get("/about", async (req, res) => {
	res.render("about");
});

router.get("/users", async (req, res) => {
	res.render("signup");
});
router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		const token = await user.generateAuthToken();
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.json({ user: user._id });
	} catch (e) {
		const error = errorHandler(e);
		res.status(400).json({ error });
		res.send(error);
	}
});

router.get("/users/login", async (req, res) => {
	res.render("login");
});

router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		// res.json({user:user._id})
		res.send({ user, token });
	} catch (e) {
		res.status(400).json({ errors: "Cannot login !" + e });
	}
});

router.get("/users/logout", auth, async (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.redirect("/");
});

// router.post('/users/logout',auth,async(req,res)=>{
//     try{
//         req.user.tokens=req.user.tokens.filter((token)=>{
//             return token.token !== req.token
//         })
//         await req.user.save()
//         res.send()
//     }catch(e){
//         res.status(500).send()
//         console.log(e)
//     }
// })

router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
});

router.get("/viewprofile", auth, async (req, res) => {
	res.render("profile");
});

router.get("/users/me", auth, async (req, res) => {
	try {
		let obj = JSON.parse(JSON.stringify(req.user));
		obj["createdAt"] = moment(req.user.createdAt).format("DD/MM/YYYY");
		res.send(obj);
	} catch (e) {
		res.status(500).send();
		console.log("Error", e);
	}
});
router.get("/update", auth, async (req, res) => {
	res.render("update");
});
router.patch("/users/me", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name", "password", "age", "email"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid Updates" });
	}

	try {
		updates.forEach((update) => {
			req.user[update] = req.body[update];
		});
		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		await req.user.remove();
		sendCancelEmail(req.user.email, req.user.name);
		res.send(req.user);
		// res.redirect()
	} catch (e) {
		res.status(500).send();
	}
});

const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|img)$/)) {
			return cb(new Error("File needs to be a image"));
		}
		cb(undefined, true);
	},
});

router.post(
	"/users/me/avatar",
	upload.single("avatar"),
	async (req, res) => {
		try {
			console.log(req.file);
			const buffer = await sharp(req.file.buffer)
				.resize({ width: 250, height: 250 })
				.png()
				.toBuffer();
			req.user.avatar = buffer;
			await req.user.save();
			res.send();
		} catch (e) {
			console.log("Error", e);
			res.send({ error: e });
		}
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete("/users/me/avatar", auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

router.get("/user/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}

		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});

router.delete("/all", async (req, res) => {
	try {
		await User.deleteMany({});
		await Tasks.deleteMany({});
		res.send({ msz: "Deleted evrything" });
	} catch (e) {
		console.log(`Cant be deleted ${e}`);
	}
});

module.exports = router;
