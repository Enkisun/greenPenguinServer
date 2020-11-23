const {Schema, model} = require('mongoose')

const schema = new Schema({
  trademark: { type: String }
});

module.exports = model('Trademark', schema);