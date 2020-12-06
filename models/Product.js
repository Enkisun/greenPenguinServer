const {Schema, model} = require('mongoose')

const schema = new Schema({
  category: { type: String, required: true },
  subcategory: { type: String },
  trademark: { type: String, required: true },
  name: { type: String, required: true },
  volume: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { data: Buffer, name: String, contentType: String },
});

module.exports = model('Product', schema)