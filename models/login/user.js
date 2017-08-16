// Load required packages
const restful   = require('node-restful')
const mongoose  = restful.mongoose
const bcrypt    = require('bcrypt-nodejs')

// Define our user schema
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  last: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  reco_code: String
})

UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
      return callback(err)
    }

    callback(null, isMatch)
  })
}

UserSchema.methods.verifyRecoveryCode = function (reco_code, callback) {
  bcrypt.compare(reco_code, this.reco_code, function(err, isMatch) {
    if (err) {
      return callback(err)
    }

    callback(null, isMatch)
  })
}

// Export the Mongoose model
module.exports = restful.model('User', UserSchema, 'doctors')
