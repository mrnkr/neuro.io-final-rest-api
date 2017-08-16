// Dependencies
const mongoose = require('mongoose')

// Define token schema
let tokenSchema = new mongoose.Schema({
  value: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true }
})

// Export token model
module.exports = mongoose.model('Token', tokenSchema)
