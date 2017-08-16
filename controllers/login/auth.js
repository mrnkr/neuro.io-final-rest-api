// Load required packages
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const BearerStrategy = require('passport-http-bearer').Strategy
const User = require('../../models/login/user')
const Client = require('../../models/login/client')
const Token = require('../../models/login/token')

passport.use('client-basic', new BasicStrategy(function (clientId, clientSecret, callback) {
  Client.findOne({ id: clientId }, function (err, client) {
    if (err) {
      return callback(err)
    }

    // Client does not exist or the pass is wrong
    if (!client) {
      return callback(null, false)
    }

    client.verifySecret(clientSecret, (err, isMatch) => {
      if (err) {
        return callback(err)
      }

      if (!isMatch) {
        return callback(null, false)
      }

      return callback(null, client)
    })
  })
}))

passport.use('recovery', new BasicStrategy(function (email, recoveryCode, callback) {
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return callback(err)
    }

    if (!user) {
      return callback(null, false)
    }

    user.verifyRecoveryCode(recoveryCode, function (err, isMatch) {
      if (err) {
        return callback(err)
      }

      if (!isMatch) {
        return callback(null, false)
      }

      return callback(null, user)
    })
  })
}))

passport.use(new BearerStrategy(function (accessToken, callback) {
  accessToken = accessToken.trim()
  Token.findOne({ value: accessToken }, function (err, token) {
    if (err) {
      return callback(err)
    }

    // No token found
    if (!token) {
      return callback(null, false)
    }

    User.findOne({ _id: token.userId }, function (err, user) {
      if (err) {
        return callback(err)
      }

      // No user found
      if (!user) {
        return callback(null, false)
      }

      if (user.verified && user.active) {
        if (user.admin) {
          return callback(null, user, { scope: 'admin' })
        }

        return callback(null, user, { scope: '*' })
      } else {
        return callback(null, false)
      }
    })
  })
}))

exports.isAuthenticated = passport.authenticate('bearer', { session : false })
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false })
exports.validateRecoveryCode = passport.authenticate('recovery', { session: false })

exports.isAdmin = function (req, res, callback) {
  // access control middleware to check for required scope
    if (req.authInfo.scope !== 'admin') {
      res.statusCode = 403
      return res.end('Forbidden')
    }

    return callback()
}
