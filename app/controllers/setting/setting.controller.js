
class setting {
    getSetting(req, res) {
        var r = req.r;
        var params = req.query;

        r.table("setting")
            .run()
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.status(500).json(err);
            })

    }
    updateSetting(req, res) {
        var r = req.r;
        var params = req.body;
        var cmds = [];
        var parameters = "";
        for (var i = 0; i < params.length; i++) {
            cmds.push(r.table("setting").get(params[i].id).update(params[i]));
            if (parameters == "") {
                parameters = "p" + i;
            } else {
                parameters = parameters + ",p" + i;
            }
        }

        var _callback = function (...args) {
            var p1 = args[0];
            var out = {
                "deleted": p1('deleted'),
                "errors": p1('errors'),
                "inserted": p1('inserted'),
                "replaced": p1('replaced'),
                "skipped": p1('skipped'),
                "unchanged": p1('unchanged')
            };
            for (var i = 1; i < args.length; i++) {
                out.deleted = out.deleted.add(args[i]('deleted'));
                out.errors = out.errors.add(args[i]('errors'));
                out.inserted = out.inserted.add(args[i]('inserted'));
                out.replaced = out.replaced.add(args[i]('replaced'));
                out.skipped = out.skipped.add(args[i]('skipped'));
                out.unchanged = out.unchanged.add(args[i]('unchanged'));
            }
            return out;
        }

        global.callback = 0;
        eval("callback=function(" + parameters + "){return _callback.apply(this,arguments);};");
        cmds.push(callback);

        r.do.apply(this, cmds)
            .run()
            .then(function (result) {
                res.json(result);
            }).catch(function (err) {
                res.status(500).json(err);
            });

    }
}
module.exports = new setting();