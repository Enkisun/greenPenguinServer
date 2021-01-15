const Product = require('../models/Product')

module.exports = {
  getProducts: async (req, res) => {
    let { page, limit, category, subcategory, trademark, sortBy, sortingOrder, search } = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    if (sortBy === 'По цене') sortBy = { price: sortingOrder === 'asc' ? 1 : -1 }
    if (sortBy === 'По алфавиту') sortBy = { name: sortingOrder === 'asc' ? 'asc' : 'desc' }
    if (!sortBy) sortBy = ''

    const query = {}
    const results = {}

    if (category || trademark  || search) {
      if (category) query.category = category
      if (subcategory) query.subcategory = subcategory

      if (trademark) {
        const trademarkArray = trademark.split(',');
        query.trademark = { $in: trademarkArray }
      }

      if (search) query.name = { $regex: search, $options: "i" }

      results.products = await Product.find(query).exec()
      let totalProductsCount = Object.keys(results.products).length
      results.totalProductsCount = { totalProductsCount }
    }

    let startIndex = (page - 1) * limit
    if (!results.totalProductsCount) { results.totalProductsCount = {totalProductsCount: await Product.countDocuments()} }

    try {
      results.products = await Product.find(query).sort(sortBy).limit(limit).skip(startIndex).exec()
      return res.json(results)
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  },

  addProduct: (req, res) => {
    const { category, subcategory, trademark, name, size, unit, price, description } = req.body
  
    const newProduct = new Product({ category, subcategory, trademark, name, size, unit, price, description });
  
    if (req.file) {
      newProduct.image = `//localhost:5000/${req.file.path}`
    }
  
    newProduct.save((error, response) => {
      if (error) {
        return res.status(400).json({ message: `${error.message}` })
      } else {
        return res.status(201).json({ response })
      }
    }) 
  },

  changeProduct: (req, res) => {
    const { category, subcategory, trademark, name, size, unit, price, description, id } = req.body;
  
    let update = { category, subcategory, trademark, name, size, unit, price, description }

    if (req.file) {
      update.image = `//localhost:5000/${req.file.path}`
    }
  
    Product.findOneAndUpdate({ _id: id }, { $set: update }, error => {
      if (error) {
        return res.status(400).json({ message: `${error.message}` })
      } else {
        res.json({ message: `editing completed successfully` })
      }
    })
  },

  deleteProduct: (req, res) => {
    const { id } = req.query;

    Product.deleteOne({ _id: id }, error => {
      if (error) {
        return res.status(400).json({ message: `${error.message}` })
      } else {
        res.json({ message: `deletion completed successfully` })
      }
    })
  }
}