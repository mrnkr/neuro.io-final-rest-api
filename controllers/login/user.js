// Load required packages
const User    = require('../../models/login/user')
const Mail    = require('./mail')
const bcrypt  = require('bcrypt-nodejs')

exports.fixIdBug = function (req, res, callback) {
  delete req.body._id
  callback()
}

exports.hashPassword = function (req, res, callback) {
  let user = req.body

  if (user.password !== '') {
    bcrypt.genSalt(5, function(err, salt) {
      if (err) {
        return callback(err)
      }

      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {
          return callback(err)
        }

        req.body.password = hash
        callback()
      })
    })
  } else {
    delete req.body.password
    callback()
  }
}

exports.generateRecoveryCode = function (req, res, callback) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  req.body.reco_code = text;
  callback()
}

exports.sendRecoveryCode = function (req, res, callback) {
  Mail.sendMail(req.params.email, 'Recuperacion de cuenta', 'El codigo para recuperar su cuenta de Neuro.IO es: ' + req.body.reco_code)
  callback()
}

exports.hashRecoveryCode = function (req, res, callback) {
  let user = req.body

  bcrypt.genSalt(5, function(err, salt) {
    if (err) {
      return callback(err)
    }

    bcrypt.hash(user.reco_code, salt, null, function(err, hash) {
      if (err) {
        return callback(err)
      }

      req.body.reco_code = hash
      callback()
    })
  })
}

exports.storeRecoveryCode = function (req, res) {
  User.findOneAndUpdate({ email: req.params.email }, { $set: { reco_code: req.body.reco_code }}, {}, function (err, doc) {
    if (err) {
      return res.send(err)
    }

    res.statusCode = 200
    res.end('OK')
  })
}

exports.changeUserPassword = function (req, res) {
  User.findOneAndUpdate({ _id: req.user._id }, { $set: { password: req.body.password, reco_code: '' }}, {}, function (err, doc) {
    if (err) {
      return res.send(err)
    }

    res.statusCode = 200
    res.end('OK')
  })
}

exports.notifyEdition = function (req, res, callback) {
  let user = req.body

  Mail.sendMail(user.email, 'Operacion exitosa', 'Su usuario en Neuro.IO se modifico con exito')
  callback()
}

exports.notifyCreation = function (req, res, callback) {
  let user = req.body

  Mail.sendMail(user.email, 'Su usuario se creo con exito', 'Para activar su usuaro dirijase al siguiente link!')
  callback()
}

exports.hidePasswords = function (req, res, callback) {
  if (res.locals.bundle.constructor === Array) {
    res.locals.bundle.forEach(item => {
      item.password = ''
    })
  } else {
    res.locals.bundle.password = ''
  }
  callback()
}

exports.getMyUser = function (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) {
      return res.send(err)
    }

    user.password = ''
    res.json(user)
  })
}

exports.verifyUserEmail = function (req, res) {
  User.findOneAndUpdate({ _id: req.params.id }, { $set: { verified: true }}, {}, function (err, doc) {
    if (err) {
      return res.send(err)
    }

    Mail.sendMail(doc.email, 'Has verificado tu email!', 'Apenas un administrador active tu cuenta podras empezar a trabajar.')
    res.statusCode = 200
    res.end('OK')
  })
}
