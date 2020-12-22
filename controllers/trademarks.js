const Trademark = require('../models/Trademark.js');

module.exports = {
  getTrademarks: (req, res) => {
    Trademark.find({}, (error, trademarks) => {
      if (error) {
        res.status(400).json({ message: e.message })
      } else {
        res.json({ trademarks })
      }
    })
  },
  addTrademark: async (req, res) => {
    let { trademark } = req.query
    
    Trademark.findOneAndUpdate({trademark}, {$set: {trademark}}, {upsert: true}, async (error, trademarks) => {
      if (error) {
        res.status(400).json({ message: error.message })
      } else {
        res.json({ trademarks })
      }
    })
  }
}