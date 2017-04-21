exports.getRoles = function (req, res) {
    var r = req.r;
    var params = req.params;
    r.table('roles').getAll(params.app_id, { index: 'app_id' }).coerceTo('array').do(function (data) {
        return {
            roles: data,
            app_name: r.table('apps').get(params.app_id)('app_name')
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

exports.putRoles = function (req, res) {
    var r = req.r;
    var params = req.body;
    //console.log(params.update);

    r.do(
        r.branch(
            r.expr(params.delete).ne(0),
            r.table('roles').getAll(r.args(params.delete)).delete(),
            'no del'
        )
        ,
        r.branch(
            r.expr(params.update).ne(0),
            r.expr(params.update).forEach(function (row) {
                return r.table('roles').get(row('id')).update(row.without('id'))
            }),
            'no update'
        )
        ,
        r.branch(
            r.expr(params.insert).ne(0),
            r.table('roles').insert(params.insert),
            'no insert'
        ),
        function () {
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

exports.manageApps = function (req, res) {
    var r = req.r;
    r.table('apps').pluck('app_name','id')
        .outerJoin(r.table('user_apps').getAll(req.params.id, { index: 'uid' })
        .merge(function(row){return {user_apps_id:row('id')}}).without('id'),
        function (left, right) {
            return left('id').eq(right('app_id'))
        })
        .zip()
        .merge(function(row){
            return r.branch(row.hasFields('role'),
                {check:true}
            ,  
                {
                    check:false,
                    app_id:row('id'),
                    uid:req.params.id,
                    role:'',
                    user_apps_id:''
                }
            )
        })
        .merge(function(row){
            return {
                list_role:r.table('roles').getAll(row('app_id'),{index:'app_id'})
                .pluck('id','role').coerceTo('array').union(
                    r.table('roles').filter(function(row){
                        return row('app_id').eq('default').and(row('id').ne('SuperAdmin'))
                    }).coerceTo('array').pluck('id','role','user_apps_id')
                )
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

exports.putManageApps = function (req, res) {
    var r = req.r;
    var params = req.body;
    r.do(
        r.expr(params.data).filter(function(row){
            return row('user_apps_id').ne('')
        }).coerceTo('array').forEach(function(row){
            return r.branch(
                row('check').eq(true)
                ,
                r.table('user_apps').get(row('user_apps_id')).update(row.pluck('role'))
                ,
                r.table('user_apps').get(row('user_apps_id')).delete()
            )
        })
        ,
        r.expr(params.data).hasFields('user_apps_id').filter(function(row){
            return row('user_apps_id').eq('')
        }).coerceTo('array').forEach(function(row){
            return r.branch(
                row('check').eq(true)
                ,
                r.table('user_apps').insert(
                    row.pluck('app_id','role','uid')
                    .merge({status:'true'})
                )
                ,
                'not add'
            )
        })

    ).run()
    .then(function (result) {
        res.json(result);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })
}