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
}

exports.putRoles = function (req, res) {
    var r = req.r;
    var params = req.body;

    r.do(
        r.branch(
            r.expr(params.delete).ne(0),
            r.table('roles').getAll(r.args(params.delete)).delete(),
            'no del'
        )
        ,
        r.branch(
            r.expr(params.update).ne(0),
            r.table('roles').update(params.update),
            'no update'
        )
        ,
        r.branch(
            r.expr(params.insert).ne(0),
            r.table('roles').insert(params.update),
            'no insert'
        ),
        function(){
            return 'ok';
        }
    ).run()
    .then(function (result) {
        res.json(result);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })
}