const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true },
  volume: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  trademark: { type: String, required: true }
})

module.exports = model('Product', schema)