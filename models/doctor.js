const restful   = require('node-restful')
const mongoose  = restful.mongoose

let doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  name: String,
  last: String
})

module.exports = restful.model('doctors', doctorSchema)
