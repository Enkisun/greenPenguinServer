const {Router} = require('express')
const Category = require('../models/Category.js');

const router = Router()

router.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  Category.find({}, (error, categories) => {
    if (error) {
      res.status(400).json({ message: e.message })
    }

    res.json({ categories })
  }) 
})

router.post('/', async (req, res) => {
  let { category, subcategory } = req.body
  let update = {}

  if (subcategory) { update = { subcategory: subcategory } }

  Category.findOneAndUpdate({category}, {$addToSet: update}, async (error, categories) => {
    if (error) {
      res.status(400).json({ message: error.message })
    }

    if (!categories) {
      await Category.create({category, subcategory: subcategory}, response => {
        res.json({ response })
      })
    } else {
      res.json({ categories })
    }
  }) 
})

module.exports = router