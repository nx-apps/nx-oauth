/*!
    @Product nylon-cli
    @title nylon-cli
    @version 1.0
    @author somchit chanudom
    @email somchit.c@nexts-corp.com
    @homepage http://www.nexts-corp.com
    @licenses http://www.nexts-corp.com/product/license
    @Copyright (c) 2016-2017
*/
var passport = require('passport');
var URL = require('url');
//const config = require(process.cwd() + '/config/config');

module.exports = function (app) {
    var db = app.nylon.req.r;
    var config = app.nylon.config;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(
        function (user, done) {
            console.log('serializeUser');
            console.log(user.id);
            return done(null, user.id);
        }
    );

    passport.deserializeUser(
        function (id, done) {
            try {
                console.log('deserializeUser');
                console.log(id);
                var user = {};
                db.table('users')
                    .get(id)
                    .pluck("id", "name", "email", "photo", "gender", "role", "status", "register")
                    .merge((users_merge) => {
                        return {
                            apps: r.table('user_apps')
                                .getAll(users_merge('id'), { index: 'uid' })
                                .coerceTo('array')
                        }
                    })
                    .run()
                    .then(function (data) {
                        console.log(data.id);
                        if (data) {
                            return done(null, data);
                        } else {
                            return done(null);
                        }

                    }).catch(function (err) {
                        return done(null, false);
                    });
            } catch (err) {
                return done(null, false);
            }


        }
    );


    //  if (config.appId == "d8fcffc5-d1ab-40f1-ac63-d2643d7b9464") {
    require('../oauth/oauth.local')(app);
    //require('../oauth/oauth.facebook')(db);
    require('../oauth/oauth.google')(app);
    //   }
    //require('../oauth/oauth.jwt')(db);

}