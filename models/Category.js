const {Schema, model} = require('mongoose')

const schema = new Schema({
  category: { type: String },
  subCategory: [{ type: String }],
});

module.exports = model('Category', schema);