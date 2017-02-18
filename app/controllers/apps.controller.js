sha1 = require('js-sha1');
config = require('../../config/config');

exports.list = function (req, res) {
    var r = req.r;
    r.db('oauth').table('apps')
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