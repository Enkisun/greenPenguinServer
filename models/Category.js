const {Schema, model} = require('mongoose')

const categorySchema = new Schema({
  name: { type: String },
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategory' }],
  trademarks: [{ type: Schema.Types.ObjectId, ref: 'Trademark' }],
});

module.exports = model('Category', categorySchema);