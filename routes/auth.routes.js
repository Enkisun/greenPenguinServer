const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')

const router = Router()

// api/auth/register
router.post('/register', [
  check('email', 'Incorrect email').isEmail(),
  check('password', 'Password minLength is 6 symbols').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: `${errors.errors[0].msg}` })
    }

    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      return res.status(400).json({ message: `this user already exist` })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, password: hashedPassword })
    await user.save()
    res.status(201).json({ message: `User have been created` })
  } catch (e) {
    res.status(500).json({ message: `What's wrong, try again` })
  }
})

// api/auth/login
router.post('/login', [
  check('email', 'Incorrect email').normalizeEmail().isEmail(),
  check('password', 'Enter password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Incorrect data' })
    }

    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: `User doesn't exist` })
    }
    const isMatchPassword = await bcrypt.compare(password, user.password)
    if (!isMatchPassword) {
      return res.status(400).json({ message: 'Incorrect data' })
    }

    const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), { expiresIn: '1h' })
    res.status(200).json({ token, userId: user.id, message: `Welcome` })
  } catch (e) {
    res.status(500).json({ message: `What's wrong, try again` })
  }
})

module.exports = router