// Dependencies
const mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

// Define the client schema
let ClientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, required: true },
  secret: { type: String, required: true },
  userId: { type: String, required: true }
})

ClientSchema.methods.verifySecret = function(secret, callback) {
  bcrypt.compare(secret, this.secret, function(err, isMatch) {
    if (err) {
      return callback(err)
    }

    callback(null, isMatch)
  })
}

let hashSecret = function (callback) {
  let client = this
  // console.log(user)

  // Break out if the password hasn't changed
  if (!client.isModified('secret')) {
    // console.log('pass didnt change')
    return callback()
  }

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) {
      return callback(err)
    }

    bcrypt.hash(client.secret, salt, null, function(err, hash) {
      if (err) {
        return callback(err)
      }

      client.secret = hash
      callback()
    })
  })
}

ClientSchema.pre('save', hashSecret)

// Export the model
module.exports = mongoose.model('Client', ClientSchema)
