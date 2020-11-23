const {Router} = require('express')
const Trademark = require('../models/Trademark.js');

const router = Router()

router.get('/', async (req, res) => {
  Trademark.find({}, (error, trademarks) => {
    if (error) {
      res.status(400).json({ message: e.message })
    }

    res.json({ trademarks })
  }) 
})

router.post('/', async (req, res) => {
  let { trademark } = req.body

  Trademark.findOneAndUpdate({trademark}, {$set: {trademark}}, async (error, trademarks) => {
    if (error) {
      res.status(400).json({ message: error.message })
    }

    if (!trademarks) {
      await Trademark.create({trademark}, response => {
        res.json({ response })
      })
    } else {
      res.json({ trademarks })
    }
  }) 
})

module.exports = router