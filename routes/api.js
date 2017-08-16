// Dependencies
const express     = require('express')
const router      = express.Router()

// Controllers
const authCtrl    = require('../controllers/login/auth')
const oauth2Ctrl  = require('../controllers/login/oauth2')
const userCtrl    = require('../controllers/login/user')
const clientCtrl  = require('../controllers/login/client')
const patCtrl     = require('../controllers/pathologies')
const stCtrl      = require('../controllers/srg_types')
const sysCtrl     = require('../controllers/sys_info')

// Models
let Patient       = require('../models/patient')
let Doctor        = require('../models/doctor')
let Surgery       = require('../models/surgery')
let User          = require('../models/login/user')

// Patient routes
Patient.methods(['get', 'put', 'post'])
Patient.before('get', authCtrl.isAuthenticated)
Patient.before('put', authCtrl.isAuthenticated)
Patient.before('post', authCtrl.isAuthenticated)
Patient.register(router, '/patients')

// Doctor routes
Doctor.methods(['get'])
Doctor.before('get', authCtrl.isAuthenticated)
Doctor.register(router, '/doctors')

// Surgery routes
Surgery.methods(['get', 'put', 'post', 'delete'])
Surgery.before('get', authCtrl.isAuthenticated)
Surgery.before('put', authCtrl.isAuthenticated)
Surgery.before('post', authCtrl.isAuthenticated)
Surgery.before('delete', authCtrl.isAuthenticated)
Surgery.register(router, '/surgeries')

router.route('/pathologies')
  .get(authCtrl.isAuthenticated, patCtrl.getPathologies)

router.route('/srg_types')
  .get(authCtrl.isAuthenticated, stCtrl.getSurgeryTypes)

  /**
   * Begin login section -
   */

User.methods(['get', 'put', 'post', 'delete'])

// GET endpoint's middleware
User.before('get', authCtrl.isAuthenticated)
User.after('get', userCtrl.hidePasswords)

// PUT endpoint's middleware
User.before('put', authCtrl.isAuthenticated)
User.before('put', userCtrl.hashPassword)
User.after('put', userCtrl.notifyEdition)
User.after('put', userCtrl.hidePasswords)

// POST endpoint's middleware
User.before('post', userCtrl.fixIdBug)
User.before('post', userCtrl.hashPassword)
User.after('post', userCtrl.notifyCreation)
User.after('post', userCtrl.hidePasswords)

// DELETE endpoint's middleware
User.before('delete', authCtrl.isAuthenticated)
User.before('delete', authCtrl.isAdmin)

User.register(router, '/users')

router.route('/user')
  .get(authCtrl.isAuthenticated, userCtrl.getMyUser)

router.route('/email_validation/:id')
  .put(userCtrl.verifyUserEmail)

// Generate a recovery code, email it to the user, hash it and store its hash
router.route('/recovery/:email')
  .put(userCtrl.generateRecoveryCode, userCtrl.sendRecoveryCode, userCtrl.hashRecoveryCode, userCtrl.storeRecoveryCode)

// Check the recovery code provided by the user and if it verifies change the password
router.route('/recover_user')
  .put(authCtrl.validateRecoveryCode, userCtrl.hashPassword, userCtrl.changeUserPassword)

router.route('/clients')
  .post(authCtrl.isAuthenticated, clientCtrl.postClients)
  .get(authCtrl.isAuthenticated, authCtrl.isAdmin, clientCtrl.getClients)

// Create endpoint handlers for oauth2 token
// GET requests are to test stored tokens
router.route('/oauth2/token')
  .get(authCtrl.isAuthenticated, function (req, res) {
    res.statusCode = 200
    res.end('OK')
  })
  .post(authCtrl.isClientAuthenticated, oauth2Ctrl.token)

/**
 * End login section -
 */

// System info
router.route('/sysinfo')
  .get(authCtrl.isAuthenticated, sysCtrl.getSystemInfo)

// Return router
module.exports = router
