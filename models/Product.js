const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true },
  volume: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  trademark: { type: String, required: true },
  image: { data: Buffer, contentType: String }
});

module.exports = model('Product', schema)