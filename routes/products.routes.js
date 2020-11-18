const {Router} = require('express')
const Product = require('../models/Product')

const router = Router()

router.get('/', paginatedResult(Product), async (req, res) => {
  // await Product.find({}, (error, result) => {
  //   if (error) {
  //     return res.status(500).json({ message: `${error.message}` })
  //   }

    // let products = []

    // result.map(product => {
    //   let { _id, name, volume, price, category, trademark } = product
    //   product = { id: _id, name, volume, price, category, trademark }
    //   products = [ ...products, product ]
    // })

  return res.json(res.paginatedResult)
})

function paginatedResult(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
  
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    results.totalProductsCount = {
      totalProductsCount: await model.countDocuments()
    }

    try {
      results.products = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResult = results
      next()
    } catch (e) { res.status(500).json({ message: e.message }) }
  }
}  

router.post('/', async (req, res) => {
  const { name, volume, price, category, trademark } = req.body;

  Product.create({ name, volume, price, category, trademark }, (error, response) => {
    if (error) {
      return res.status(500).json({ message: `${error.message}` })
    }

    return res.status(201).json({ response })
  }) 
})

router.delete('/', async (req, res) => {
  const { id } = req.body;

  Product.deleteOne({ _id: id }, error => {
    if (error) {
      return res.status(400).json({ message: `${error.message}` })
    }

    res.status(202).json({ message: `deletion completed successfully` })
  })
})

router.put('/', async (req, res) => {
  const { name, id } = req.body;

  Category.updateOne({ _id: id }, { $addFields: { name }}, error => {
    if (error) {
      return res.status(400).json({ message: `${error.message}` })
    } 

    res.status(204).json({ message: `editing completed successfully` })
  }) 
})

module.exports = router