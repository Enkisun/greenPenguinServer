const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  // subCategory: { type: Array, "default": [] },
});

module.exports = model('Category', schema);

// db.update({'Searching criteria goes here'},
// {
//  $push : {
//     trk :  {
//              "lat": 50.3293714,
//              "lng": 6.9389939
//            } //inserted data is the object to be inserted 
//   }
// });

// const product = new Product({
//   name: req.body.name,
//   ...
//   imageSrc: req.file ? req.file.path : ''
// })