const express = require("express");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
require("colors");
require("./db/mongoose");
require("dotenv").config({ path: "./config/dev.env" });

const { checkUser } = require("./middleware/auth");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const connectDB = require("./db/mongoose");

connectDB();
const app = express();
const port = process.env.PORT;

const publicPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../template/views");
const partialPath = path.join(__dirname, "../template/partials");

app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialPath);
app.use(express.static(publicPath));

app.use(express.json());
app.use(cookieParser());

app.get("/", checkUser, (req, res) => {
	res.render("home");
});

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}`.yellow);
});
