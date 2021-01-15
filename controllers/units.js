const Unit = require('../models/Unit')

module.exports = {
  getUnits: (req, res) => {
    Unit.find({}, (error, units) => {
      if (error) {
        return res.status(400).json({ message: e.message })
      } 
      
      res.json({ units })
    })
  },
  addUnit: (req, res) => {
    const { unit } = req.query

    Unit.findOneAndUpdate({ name: unit }, {}, { upsert: true }, (error, units) => {
      if (error) {
        return res.status(400).json({ message: error.message })
      }

      res.json({ units })
    })
  }
}