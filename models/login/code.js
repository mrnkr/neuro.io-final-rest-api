// Dependencies
const mongoose = require('mongoose')

// Define token schema
let codeSchema = new mongoose.Schema({
  value: { type: String, required: true },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true }
})

// Export the model
module.exports = mongoose.model('Code', codeSchema)
