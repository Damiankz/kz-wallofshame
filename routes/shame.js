const express = require('express');
const router = express.Router();
const Shame = require('../models/shame')

router.get('/', async (req, res) => {
    try {
        const shames = await Shame.find()
        res.json(shames)
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

// Method to get Shame By Id
//
// router.get('/:id', getShame,async (req, res) => {
//   res.json(res.shame)
// })

router.get('/:author', async(req, res) => {
    const author = req.params.author
    try {
      const shames = await Shame.find({ 'author': author }, function (err, docs) {
        return docs
      })
      res.json(shames)
  } catch (err){
      res.status(500).json({message: err.message})
  }
    
})

router.post('/', async (req, res) => {
    const shame = new Shame({
      author: req.body.author,
      quote: req.body.quote
    })
    try {
      const newShame = await shame.save()
      res.status(201).json(newShame)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
})

router.post('/web', async (req, res) => {
  const shame = new Shame({
    author: req.body.author,
    quote: req.body.quote
  })
  try {
    const newShame = await shame.save()
    res.redirect('/')
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', getShame, async (req, res) => {
  try {
    await res.shame.remove()
    res.json({ message: 'Poop erased' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getShame(req, res, next) {
  let shame
  try {
    shame = await Shame.findById(req.params.id)
    if (shame == null) {
      return res.status(404).json({ message: 'Cannot find the document' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.shame = shame
  next()
}

module.exports = router