const restful   = require('node-restful')
const mongoose  = restful.mongoose

let surgerySchema = new mongoose.Schema({
  scheduled: {
    type: Date,
    default: '1970-01-01T00:00:00.000Z'
  },
  type: {
    type: String,
    required: true
  },
  pathology: {
    type: String,
    required: true
  },
  preop_valid: Date,
  anes_valid: Date,
  done: {
    type: Boolean,
    default: false
  },
  gos: Number,
  cod: Boolean,
  patient: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'patients',
    required: true
  },
  surgeon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors',
    required: true
  },
  comments: [
    {
      moment: Date,
      body: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors'
      }
    }
  ]
})

module.exports = restful.model('surgeries', surgerySchema)
