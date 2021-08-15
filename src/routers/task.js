const express = require("express");
const { auth, checkUser } = require("../middleware/auth");
const moment = require("moment");

const Tasks = require("../models/task");

const router = new express.Router();

router.get("*", checkUser);
router.get("/addtask", auth, async (req, res) => {
	res.render("addtask");
});

router.post("/addtask", auth, async (req, res) => {
	const task = new Tasks({
		...req.body,
		owner: req.user._id,
	});
	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});
router.get("/tasks", auth, async (req, res) => {
	res.render("tasks");
});

router.get("/task", auth, async (req, res) => {
	try {
		const match = {};
		const sort = {};
		if (req.query.completed) {
			match.completed = req.query.completed === "true";
		}
		if (req.query.sortBy) {
			const parts = req.query.sortBy.split(":");
			sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
		}
		const tasks = await Tasks.find({ owner: req.user });

		const modifiedTasks = [];
		tasks.forEach((task) => {
			modifiedTasks.push({
				_id: task._id,
				description: task.description,
				completed: task.completed,
				dateOfCreation: moment(task.createdAt).format("DD/MM/YYYY"),
				timeOfCreation: moment(task.createdAt).format("hh:mm A"),
			});
		});
		res.status(201).send(modifiedTasks);
	} catch (e) {
		res.status(500).send(e);
		console.log(e);
	}
});

router.get("/task/:id", auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Tasks.findOne({ _id, owner: req.user._id });
		if (!task) {
			return res.send(404);
		}
		const modifiedTask = {
			_id: task._id,
			description: task.description,
			completed: task.completed,
			dateOfCreation: moment(task.createdAt).format("DD/MM/YYYY"),
			timeOfCreation: moment(task.createdAt).format("hh:mm A"),
		};
		res.status(201).send(modifiedTask);
	} catch (e) {
		res.status(500).send(e);
		console.log(e);
	}
});

router.patch("/task/:id", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const validUpdates = ["description", "completed"];
	const isValidOperation = updates.every((update) =>
		validUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid Updates" });
	}

	try {
		const task = await Tasks.findOne({
			_id: req.params.id,
			owner: req.user._id,
		});
		updates.forEach((update) => {
			task[update] = req.body[update];
		});
		if (!task) {
			return res.status(404).send();
		}
		await task.save();
		res.send(task);
	} catch (e) {
		res.status(400).send(e);
		console.log(e);
	}
});
router.delete("/deletetask/:id", auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const tasks = await Tasks.findOneAndDelete({
			_id,
			owner: req.user._id,
		});
		if (!tasks) {
			return res.send(404);
		}
		res.status(201).send(tasks);
	} catch (e) {
		res.status(500).send(e);
		console.log(e);
	}
});

module.exports = router;
