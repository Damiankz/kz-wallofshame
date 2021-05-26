const express = require("express");
const router = express.Router();
const Person = require("../models/person");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/');
  },
  filename: function(req, file, cb) {
    cb(null, req.body.name + '.jpg');
  }
});

const upload = multer({storage: storage, dest: "public/" });

router.post("/", upload.single("portrait"), async (req, res) => {
  const person = new Person({
    name: req.body.name,
    portrait: req.body.name + '.jpg',
  });
  try {
    const newPerson = await person.save();
    res.status(201).json(newPerson)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
