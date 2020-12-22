const {Schema, model} = require('mongoose')

const schema = new Schema({
  category: { type: String, required: true },
  subcategory: { type: String },
  trademark: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number },
  unit: { type: String },
  weight: { type: Number },
  volume: { type: Number },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

module.exports = model('Product', schema)