const Surgery = require('../models/surgery')

exports.getSurgeryTypes = function(req, res) {
  Surgery.distinct('type', (err, types) => {
    if (err)
      return res.send(err);

    res.json(types);
  })
}
