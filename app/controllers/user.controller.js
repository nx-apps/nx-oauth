const _ = require('lodash');
const sha1 = require('js-sha1');

exports.list = function (req, res) {
    var r = req.r;
    r.table('users')
        .merge((users_merge) => {
            return {
                providers: r.table('user_providers')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array'),
                apps: r.table('user_apps')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array')
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

exports.info = function (req, res) {
    var r = req.r;
    r.table('users')
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
    r.table('users')
        .filter(req.query)
        .merge((users_merge) => {
            return {
                providers: r.table('user_providers')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array'),
                apps: r.table('user_apps')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array')
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
    r.table('users')
        .get(req.params.id)
        .merge((users_merge) => {
            return {
                providers: r.table('user_providers')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array'),
                apps: r.table('user_apps')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array')
                    .innerJoin(r.table('apps'), function (left, right) {
                        return left('app_id').eq(right('id'))
                    })
                    .map(function (row) {
                        return row('left').merge(row('right').pluck('app_name', 'icon_url', 'allow_callback_url'))
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


exports.infoById = function (req, res) {
    var r = req.r;
    r.table('users')
        .get(req.params.id).merge(function (row) {
            return row('providers').filter(function (row) {
                return row('provider').eq('local')
            }).do(function (result) {
                return r.branch(result.count().eq(0),{},{ local:{id: result(0)('id')}})
            })
        }).without('providers')
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
    var data = req.body

    data.register = true;
    data.providers = [];
    if (data.local) {
        data.providers = [{
            id: data.local.id,
            password: sha1(data.local.password),
            provider: 'local'
        }]
    }
    
    console.log(data.provider);
    data = _.omit(data, ['local']);

    r.table('users').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })

}
exports.update = function (req, res) {
    var r = req.r;
    r.table('users')
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
    r.table('users')
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