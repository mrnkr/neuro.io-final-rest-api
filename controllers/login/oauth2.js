// Dependencies
const oauth2orize = require('oauth2orize')
const User = require('../../models/login/user')
const Client = require('../../models/login/client')
const Token = require('../../models/login/token')
const Code = require('../../models/login/code')

function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create OAuth2 Server
let server = oauth2orize.createServer()

// Serialization function
server.serializeClient(function (client, callback) {
  return callback(null, client._id)
})

// Deserialization function
server.deserializeClient(function (id, callback) {
  Client.findOne({ _id: id }, function (err, client) {
    if (err) {
      return callback(err)
    }

    return callback(null, client)
  })
})

// Exchange password for access token
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, callback) {
  User.findOne({ email: username }, function (err, user) {
    if (err) {
      return callback(err)
    }

    if (!user) {
      return callback(null, false)
    }

    if (!user.active) {
      return callback(null, false)
    }

    if (!user.verified) {
      return callback(null, false)
    }

    user.verifyPassword(password, function (err, isMatch) {
      if (err) {
        return callback(err)
      }

      if (!isMatch) {
        return callback(null, false)
      }

      // Delete all old tokens which were issued to the user
      Token.remove({userId: user._id}, function (err) {
        if (err) {
          console.log(err)
        }
      })

      // Return new access token
      let token = new Token({
        value: uid(256),
        clientId: client.id,
        userId: user._id
      })

      // Save access token and check for errors
      token.save(function (err) {
        if (err) {
          return callback(err)
        }

        callback(null, token.value)
      })
    })
  })
}))

// User auth endpoint
exports.authorization = [
  server.authorization(function (clientId, redirectUri, callback) {
    Client.findOne({ id: clientId }, function (err, client) {
      if (err) {
        return callback(err)
      }

      return callback(null, client, redirectUri)
    })
  }),
  function (req, res) {
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client })
  }
]

// User decision endpoint
exports.decision = [
  server.decision()
]

// Application token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
]

exports.showToken = function (req, res) {
  res.json( { code: req.query.code } )
}
