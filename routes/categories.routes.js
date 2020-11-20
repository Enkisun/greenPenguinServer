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
  const category = new Category({
    name: req.body.name,
    imageSrc: req.file ? req.file.path : ''
  })

  try {
    await category.save()
    res.status(201).json(category)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

module.exports = router