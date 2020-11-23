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
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const category = req.query.category
    const subCategory = req.query.subCategory
    const trademark = req.query.trademark

    const trademarkArray = trademark.split(',')
    const startIndex = (page - 1) * limit

    const query = {}
    const results = {}

    if (category) {
      query.category = category
    } else {
      results.totalProductsCount = { totalProductsCount: await model.countDocuments() }
    }

    if (subCategory) query.subCategory = subCategory
    if (trademark) query.trademark = { $in: trademarkArray }

    try {
      results.products = await model.find(query).limit(limit).skip(startIndex).exec()

      let totalProductsCount = Object.keys(results.products).length
      if (!results.totalProductsCount) results.totalProductsCount = { totalProductsCount }

      res.paginatedResult = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

router.get('/', paginatedResult(Product), async (req, res) => {
  return res.json(res.paginatedResult)
})

router.post('/', upload.single('image'), async (req, res) => {
  const { name, volume, price, category, subCategory, trademark } = req.body

  const newProduct = new Product({ name, volume, price, category, subCategory, trademark });

  if (req.file) {
    newProduct.image.data = fs.readFileSync(req.file.path)
    newProduct.image.contentType = req.file.mimetype;
  }

  newProduct.save((error, response) => {
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