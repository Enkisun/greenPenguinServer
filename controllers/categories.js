const Category = require('../models/Category')

module.exports = {
  getCategories: (req, res) => {
    Category.find({}, (error, categories) => {
      if (error) {
        res.status(400).json({ message: e.message })
      } else {
        res.json({ categories })
      }
    })
  },
  addCategory: (req, res) => {
    const { category, subcategory } = req.query
  
    let update = {}
  
    if (subcategory) update = { subcategory }
  
    Category.findOneAndUpdate({category}, {$addToSet: update}, async (error, categories) => {
      if (error) {
        res.status(400).json({ message: error.message })
      }
  
      if (!categories) {
        await Category.create({category, subcategory}, response => {
          res.json({ response })
        })
      } else {
        res.json({ categories })
      }
    }) 
  }
}