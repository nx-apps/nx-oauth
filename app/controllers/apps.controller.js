sha1 = require('js-sha1');
config = require('../../config/config');

exports.list = function (req, res) {
    var r = req.r;
    r.db('oauth').table('apps')
        .merge((apps_merge) => {
            return {
                connections: apps_merge('connections')
                    .map((cons_map) => {
                        return r.db('oauth').table('providers').get(cons_map)
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
    r.db('oauth').table('apps')
        .filter(req.query)
        .merge((apps_merge) => {
            return {
                connections: apps_merge('connections')
                    .map((cons_map) => {
                        return r.db('oauth').table('providers').get(cons_map)
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
    r.db('oauth').table('apps')
        .get(req.params.id)
        .merge((apps_merge) => {
            return {
                connections: apps_merge('connections')
                    .map((cons_map) => {
                        return r.db('oauth').table('providers').get(cons_map)
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
    req.body.allow_callback_url = "https://localhost:" + config.server.port + "/" + req.body.app_name.toLowerCase() + "/oauth/callback";
    req.body.allow_logout_url = "https://localhost:" + config.server.port + "/" + req.body.app_name.toLowerCase() + "/oauth/logout";
    r.db('oauth').table('apps')
        .insert(req.body)
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
    r.db('oauth').table('apps')
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
    r.db('oauth').table('apps')
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

exports.getBalanceList = function (req, res) {
    var r = req.r;
    var params = req.params;
    r.db('oauth').table('apps').pluck('id','app_name').merge(function(row){
        return {
            users:
            r.db('oauth').table('user_apps').getAll(row('id'),{index:'app_id'})
            .map(function(row2){
                return row2('uid')
            })
            .coerceTo('array')
            
        }
    })
    .filter(function(row){
        return row('users').contains(params.user_id).not()
    })
    .without('users')
    .run()
    .then(function (result) {
        res.json(result);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })

    
}

exports.insertRequest = function(req, res){
    var r = req.r;
    var params = req.body;
    params.role = 'user';
    params.status = false;

    r.db('oauth').table('user_apps').insert(params)
    .run()
    .then(function (result) {
        res.json(result);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })
}


