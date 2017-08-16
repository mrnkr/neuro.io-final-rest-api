const restful   = require('node-restful')
const mongoose  = restful.mongoose

let patientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  last: String,
  birthdate: Date,
  background: String
})

module.exports = restful.model('patients', patientSchema)
