const {Router} = require('express')
const Product = require('../models/Product')
const multer = require('multer');
const fs = require('fs');

const router = Router()

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg|wav|tif|gif)$/)) {
      var err = new Error();
      err.code = 'filetype';
      return cb(err);
    } else {
      cb(null, Date.now() + "_" + file.originalname);
    }
  }
})

const upload = multer({ storage })

const paginatedResult = model => {
  return async (req, res, next) => {
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

      const trademarkArray = trademark.split(',')
      if (trademark) query.trademark = { $in: trademarkArray }

      if (search) query.name = { $regex: search, $options: "i" }

      results.products = await model.find(query).exec()
      let totalProductsCount = Object.keys(results.products).length
      results.totalProductsCount = { totalProductsCount }
    }

    let startIndex = (page - 1) * limit
    if (!results.totalProductsCount) { results.totalProductsCount = {totalProductsCount: await model.countDocuments()} }

    try {
      results.products = await model.find(query).sort(sortBy).limit(limit).skip(startIndex).exec()
      res.paginatedResult = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

router.get('/', paginatedResult(Product), async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  return res.json(res.paginatedResult)
})

router.post('/', upload.single('image'), async (req, res) => {
  const { category, subcategory, trademark, name, volume, weight, price, description } = req.body

  const newProduct = new Product({ category, trademark, name, volume, weight, price, description });

  if (subcategory) { newProduct.subcategory = subcategory }

  if (req.file) {
    newProduct.image.data = fs.readFileSync(req.file.path)
    newProduct.image.name = req.file.originalname;
    newProduct.image.contentType = req.file.mimetype;
  }

  newProduct.save((error, response) => {
    if (error) {
      return res.status(500).json({ message: `${error.message}` })
    }

    return res.status(201).json({ response })
  }) 
})

router.put('/', upload.single('image'), async (req, res) => {
  const { category, subcategory, trademark, name, volume, weight, price, description, id } = req.body;
  let image = req.file;

  let update = { category, trademark, name, volume, weight, price, description }

  if (subcategory) { update.subcategory = subcategory }

  if (image) {
    image.data = fs.readFileSync(req.file.path)
    image.name = req.file.originalname;
    image.contentType = req.file.mimetype;
    update.image = image;
  }

  Product.findOneAndUpdate({ _id: id }, { $set: update }, error => {
    if (error) {
      return res.status(400).json({ message: `${error.message}` })
    } 

    res.status(201).json({ message: `editing completed successfully` })
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

module.exports = router