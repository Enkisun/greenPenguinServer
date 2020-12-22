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
    
    Trademark.findOneAndUpdate({trademark}, {$set: {trademark}}, async (error, trademarks) => {
      if (error) {
        res.status(400).json({ message: error.message })
      }

      if (!trademarks) {
        await Trademark.create({trademark}, response => res.json({ response }))
      } else {
        res.json({ trademarks })
      }
    })
  }
}