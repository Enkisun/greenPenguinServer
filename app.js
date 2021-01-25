const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cfg = require('./config')
const upload = require('./upload')
const categoriesController = require('./controllers/categories')
const productsController = require('./controllers/products')
const UnitsController = require('./controllers/units')
const TrademarksController = require('./controllers/trademarks')

const app = express()

mongoose.set('useFindAndModify', false);

app.use('/uploads', express.static('uploads'))

app.use(cors())

app.route('/categories')
 .get(categoriesController.getCategories)
 .post(categoriesController.addCategory)

app.route('/products')
 .get(productsController.getProducts)
 .post(upload.single("image"), productsController.addProduct)
 .put(upload.single("image"), productsController.changeProduct)
 .delete(productsController.deleteProduct)

 app.route('/units')
 .get(UnitsController.getUnits)
 .post(UnitsController.addUnit)

 app.route('/trademarks')
 .get(TrademarksController.getTrademarks)
 .post(TrademarksController.addTrademark)

async function start() {
  try {
    await mongoose.connect(cfg.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(cfg.port, () => console.log(`App has been started on port ${cfg.port}...`))
  } catch (e) {
    console.log(`Server error: ${e.message}`)
    process.exit(1)
  }
}

start()