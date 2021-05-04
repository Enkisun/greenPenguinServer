const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const Trademark = require('../models/Trademark')

module.exports = {
  getCategories: (req, res) => {
    Category.find({}).populate('subcategories').populate('trademarks').exec((error, categories) => {
      if (error) {
        res.status(400).json({ message: e.message })
      } else {
        res.json({ categories })
      }
    })
  },
  addCategory: async (req, res) => {
    const { category, subcategory, trademark } = req.query

    const newTrademark = await Trademark.findOneAndUpdate({ name: trademark }, {}, { upsert: true }, error => {
      if (error) {
        res.status(400).json({ message: error.message })
      }
    })

    let update = { trademarks: newTrademark._id }

    let newSubcategory = {}
    
    if (subcategory) {
      newSubcategory = await Subcategory.findOneAndUpdate({ name: subcategory }, {}, { upsert: true }, error => {
        if (error) {
          return res.status(400).json({ message: error.message })
        }
      })
    }

    if (newSubcategory._id) {
      update.subcategories = newSubcategory._id
    }

    Category.findOneAndUpdate({ name: category }, { $addToSet: update }, { upsert: true }, (error, categories) => {
      if (error) {
        return res.status(400).json({ message: error.message })
      }

      res.json({ categories })
    }) 
  }
}