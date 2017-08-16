const os  =   require('os')

exports.getSystemInfo = function (req, res) {
  const retVal = {
    cpus: os.cpus(),
    mem: {
      free: os.freemem(),
      total: os.totalmem()
    },
    platform: {
      type: os.type(),
      arch: os.arch()
    },
    uptime: os.uptime()
  }

  res.statusCode = 200
  res.json(retVal)
}