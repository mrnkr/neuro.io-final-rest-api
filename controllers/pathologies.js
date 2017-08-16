const Surgery = require('../models/surgery')

exports.getPathologies = function(req, res) {
  Surgery.distinct('pathology', (err, pathologies) => {
    if (err)
      return res.send(err);

    res.json(pathologies);
  })
}
