exports.getById = function (req, res) {
    var r = req.r;
    r.db('oauth').table('apps')
        .get(req.params.id)
        .pluck('id', 'connections')
        .merge(function (apps_merge) {
            return {
                connections: r.db('oauth').table('providers').coerceTo('array')
                    .merge((conx_merge) => {
                        return {
                            status: r.branch(
                                apps_merge('connections').contains((apps_contains) => {
                                    return apps_contains.eq(conx_merge('id'))
                                }),
                                true, false
                            )
                        }
                    })
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}