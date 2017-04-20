sha1 = require('js-sha1');
config = require('../../config/config');

exports.list = function (req, res) {
    var r = req.r;
    r.table('apps')
        .merge((apps_merge) => {
            return {
                connections: apps_merge('connections')
                    .map((cons_map) => {
                        return r.table('providers').get(cons_map)
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
exports.get = function (req, res) {
    var r = req.r;
    r.table('apps')
        .filter(req.query)
        .merge((apps_merge) => {
            return {
                connections: apps_merge('connections')
                    .map((cons_map) => {
                        return r.table('providers').get(cons_map)
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
exports.getById = function (req, res) {
    var r = req.r;
    r.table('apps')
        .get(req.params.id)
        .merge((apps_merge) => {
            return {
                connections: apps_merge('connections')
                    .map((cons_map) => {
                        return r.table('providers').get(cons_map)
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
exports.insert = function (req, res) {

    var r = req.r;
    req.body.app_secret = sha1(req.body.app_domain);
    appKey = req.body.app_secret;
    //req.body.allow_callback_url = "https://localhost:" + config.server.port + "/" + req.body.app_name.toLowerCase() + "/oauth/callback";
    //req.body.allow_logout_url = "https://localhost:" + config.server.port + "/" + req.body.app_name.toLowerCase() + "/oauth/logout";
    r.table('apps')
        .insert(req.body)
        .run()
        .then(function (result) {
            console.log(result);
            appId = result.generated_keys[0];
            r.db('rethinkdb')
                .table('users')
                .insert({ id: appId, password: appKey })
                .run()
                .then(function (re) {
                   console.log(appId.replace(/-/g,""));
                    var dbId=appId.replace(/-/g,"");
                    // r.dbCreate(dbId).run().then(function (e) {
                    //     r.db(dbId).grant(appId, { read: true, write: true, config: true })
                    //         .run()
                    //         .then(function (x) {
                                 res.json(result);
                    //         });
                    // });
                }).catch(function (e) {
                    res.status(500).json(err);
                });

        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.update = function (req, res) {
    var r = req.r;
    r.table('apps')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.delete = function (req, res) {
    var r = req.r;
    r.table('apps')
        .get(req.params.id)
        .delete()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}


exports.roles = function (req, res) {
    var r = req.r;
    r.table('apps')
        .get(req.params.id)
        .pluck('id', 'app_name', 'role')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}

exports.connects = function (req, res) {
    var r = req.r;
    r.table('apps')
        .get(req.params.id)
        .pluck('id', 'app_name', 'connections')
        .merge(function (apps_merge) {
            return {
                connections: r.table('providers').coerceTo('array')
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
                    .orderBy('provider', 'provider_name')
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

exports.users = function (req, res) {
    var r = req.r;
    r.table('apps')
        .get(req.params.id)
        .pluck('id', 'app_name', 'role')
        .merge((apps_merge) => {
            return {
                users: r.table('user_apps')
                    .getAll(apps_merge('id'), { index: 'app_id' })
                    .coerceTo('array')
                    .merge(function (row) {
                        return r.table('users').get(row('uid')).pluck('name', 'email')
                    })

            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
}

exports.update_users = function (req, res) {
    res.send(req.body);
    var r = req.r;
    if (req.body.updates.length > 0) {
        r.expr(req.body.updates)
            .forEach(function (row) {
                return r.table('user_apps').get(row('id')).update(row.without('id'))
            })
            .run()
            .then(function (result) {

                if (req.body.deletes.length > 0) {
                    r.expr(req.body.deletes)
                        .forEach(function (row) {
                            return r.table('user_apps').get(row('id')).delete(row)
                        })
                        .run()
                        .then(function (result) {
                            res.json(result);
                        })
                        .catch(function (err) {
                            res.status(500).json(err);
                        })
                } else {
                    res.json(result);
                }
            }).catch(function (err) {
                res.status(500).json(err);
            })
    } else if (req.body.deletes.length > 0) {
        r.expr(req.body.deletes)
            .forEach(function (row) {
                return r.table('user_apps').get(row('id')).delete(row)
            })
            .run()
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.status(500).json(err);
            })
    }

}

exports.getBalanceList = function (req, res) {
    var r = req.r;
    r.table('apps').pluck('id', 'app_name').merge(function (row) {
        return {
            users:
            r.table('user_apps').getAll(row('id'), { index: 'app_id' })
                .map(function (row2) {
                    return row2('uid')
                })
                .coerceTo('array')

        }
    })
        // .filter(function (row) {
        //     return row('users').contains(req.user.id).not()
        // })
        .without('users')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })


}

exports.insertRequest = function (req, res) {
    var r = req.r;
    var params = req.body;
    params.uid = req.user.id;
    params.role = 'user';
    params.status = false;

    r.table('user_apps').insert(params)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}


exports.getAppList = function (req, res) {
    var r = req.r;
    r.table('apps')
    .merge(function (){
        return {
            status: true,
            allowMange: true
        }
    })
    .then(function (result) {
        res.json(result);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })
    

    // var r = req.r;
    // res.json(req.user);

    // if (req.user.role == "ADMIN") {

    //     r.table('apps')
    //         .merge(function () {
    //             return {
    //                 status: true,
    //                 allowMange: true
    //             }
    //         })
    //         .then(function (result) {
    //             res.json(result);
    //         })
    //         .catch(function (err) {
    //             res.status(500).json(err);
    //         })


    // } else {

    //     r.table('user_apps')
    //     .filter({
    //         uid: req.user.id
    //     })
    //     .innerJoin(r.table('apps'), function (left, right) {
    //         return left('app_id').eq(right('id'))
    //     })
    //         .map(function (row) {
    //             return row('right').merge(function (row2) {
    //                 return {
    //                     status: row('left')('status')
    //                     ,allowMange: row('left')('role').eq('admin')
    //                 }
    //             })
    //         })
    //         .then(function (result) {
    //             res.json(result);
    //         })
    //         .catch(function (err) {
    //             res.status(500).json(err);
    //         })

    // }

    // r.db('oauth').table('users')
    //     .get(req.params.id)
    //     .merge((users_merge) => {
    //         return {
    //             providers: r.db('oauth').table('user_providers')
    //                 .getAll(users_merge('id'), { index: 'uid' })
    //                 .coerceTo('array'),
    //             apps: r.db('oauth').table('user_apps')
    //                 .getAll(users_merge('id'), { index: 'uid' })
    //                 .coerceTo('array')
    //                 .innerJoin(r.db('oauth').table('apps'),function(left,right){
    //                     return left('app_id').eq(right('id'))
    //                 })
    //                 .map(function(row){
    //                     return row('left').merge(row('right').pluck('app_name','icon_url','allow_callback_url'))
    //                 })
    //         }
    //     })
    //     .run()
    //     .then(function (result) {
    //         res.json(result);
    //     })
    //     .catch(function (err) {
    //         res.status(500).json(err);
    //     })
}

exports.getClient = function (req, res) {
    var r = req.r;
    var params = req.query;

    r.table('user_apps').get(params.id)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}