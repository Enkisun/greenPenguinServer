const Trademark = require('../models/Trademark')

module.exports = {
  getTrademarks: (req, res) => {
    Trademark.find({}, (error, trademarks) => {
      if (error) {
        return res.status(400).json({ message: e.message })
      } 
      
      res.json({ trademarks })
    })
  },
  addTrademark: (req, res) => {
    const { trademark } = req.query

    Trademark.findOneAndUpdate({ name: trademark }, {}, { upsert: true }, (error, trademarks) => {
      if (error) {
        return res.status(400).json({ message: error.message })
      }

      res.json({ trademarks })
    })
  }
}