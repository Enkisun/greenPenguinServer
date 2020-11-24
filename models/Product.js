const {Schema, model} = require('mongoose')

const schema = new Schema({
  category: { type: String, required: true },
  subCategory: { type: String },
  trademark: { type: String, required: true },
  name: { type: String, required: true },
  volume: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { data: Buffer, contentType: String },
});

module.exports = model('Product', schema)