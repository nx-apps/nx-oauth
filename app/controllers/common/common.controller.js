
class common {
    appList(req,res){
        var r = req.r;
        r.table('apps').pluck('id','app_name')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
    }

    roleList(req,res){
        var r = req.r;
        r.table('roles')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
    }

}

module.exports = new common();