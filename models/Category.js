const {Schema, model} = require('mongoose')

const schema = new Schema({
  category: { type: String },
  subcategory: [{ type: String }],
});

module.exports = model('Category', schema);