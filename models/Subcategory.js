const {Schema, model} = require('mongoose')

const subcategorySchema = new Schema({
  name: { type: String },
});

module.exports = model('Subcategory', subcategorySchema);