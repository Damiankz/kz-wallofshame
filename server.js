const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shameRouter = require("./routes/shame");
const Shame = require("./models/shame");
const Person = require("./models/person");
const personRouter = require("./routes/person");

const uri = process.env.MONGODB_URI || "mongodb+srv://admin:admin@wallofshame.d9pcl.mongodb.net/WallOfShame?retryWrites=true&w=majority";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.get("/", async (req, res) => {
  await Shame.countDocuments().exec(function (err, count) {
    var random = Math.floor(Math.random() * count);
    Shame.findOne()
      .skip(random)
      .exec(async function (err, result) {
        const person = await Person.find({ 'name': result.author }, function (err, docs) {
          return docs
        })
        res.render("wos", { shame: result, person: person[0]});
      });
  });
});

app.get("/blame", async (req, res) => {
  try {
    const persons = await Person.find();
    res.render("blame", {persons: persons});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use("/shame", shameRouter);
app.use("/person", personRouter);


app.listen(3000, () => console.log("server up"));
