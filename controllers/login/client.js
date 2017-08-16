// Dependencies
const Client = require('../../models/login/client')

// POST request handler
exports.postClients = function (req, res) {
  // Create new instance of the Client model
  let client = new Client()

  // Set the properties to those that came in the POST request
  client.name = req.body.name
  client.id = req.body.id
  client.secret = req.body.secret
  client.userId = req.body.userId

  // Save client and check for errors
  client.save(function (err) {
    if (err) {
      res.send(err)
    }

    res.statusCode = 202
    res.end('Created')
  })
}

// GET request handler
exports.getClients = function (req, res) {
  // Use the client model to find all clients
  Client.find({ userId: req.user._id }, function (err, clients) {
    if (err) {
      res.send(err)
    }

    res.statusCode = 200
    res.json(clients)
  })
}
