exports.getRoles = function (req, res) {
    var r = req.r;
    var params = req.params;
    r.table('roles').getAll(params.app_id,{index:'app_id'})
    .run()
    .then(function (result) {
        res.json(result);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })
    //res.json({test:'sss'});
}

exports.putRoles = function (req, res) {
    var r = req.r;
    var params = req.params;
    r.table('roles').getAll(params.app_id,{index:'app_id'})
    .run()
    .then(function (result) {
        res.json(result);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })
    //res.json({test:'sss'});
}