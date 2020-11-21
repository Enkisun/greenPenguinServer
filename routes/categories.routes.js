const {Router} = require('express')
const Category = require('../models/Category.js');

const router = Router()

router.get('/', async (req, res) => {
  Category.find({}, (error, categories) => {
    if (error) {
      res.status(400).json({ message: e.message })
    }

    res.json({ categories })
  }) 
})

router.post('/', async (req, res) => {
  let { category, subCategory } = req.body
  // let options = { upset: true, new: true }

  Category.findOneAndUpdate({category}, { $push: {subCategory} }, async (error, categories) => {
    if (error) {
      res.status(400).json({ message: error.message })
    }

    if (!categories) {
      await Category.create({category, subCategory}, response => {
        res.json({ response })
      })
    } else {
      res.json({ categories })
    }
  }) 
})

module.exports = router