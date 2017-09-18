var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
//const config = require(process.cwd() + '/config/config');
var r=null;
var setConfigGoogle=function(config){
    passport.use(new GoogleStrategy(
        {
            clientID: config.client_id,
            clientSecret: config.client_secret,
            callbackURL: config.callback_url,
            passReqToCallback: true
        },callbackLogin
    ));
}

var callbackLogin=function(req, accessToken, refreshToken, profile, done){
    console.log("GoogleStrategy");
    var user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        gender: profile.gender,
        status: false,
        register: false,
        role: "User",
        providers: [{
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            gender: profile.gender,
            provider: profile.provider,
            accessToken: accessToken,
            refreshToken: refreshToken
        }]
    };

    r.table('users').filter(function (ff) {
        return ff('providers').contains(function (cc) {
            return cc('id').eq(user.providers[0].id)
                .and(cc('provider').eq(user.providers[0].provider))
        })
    }).run()
        .then(function (data) {
            if (data.length > 0) {
                console.log(data[0].id);
                var u = data[0];
                for (var i = 0; i < u.providers.length; i++) {
                    if ((u.providers[i].provider == user.providers[0].provider) && (u.providers[i].id == user.providers[0].id)) {
                        u.providers[i] = user.providers[0];
                        break;
                    }
                }
                r.table('users').get(u.id).update(u).run().then(function (data) {
                    //console.log(u.id);
                    u.register=true;
                    return done(null, u);
                });
            } else {

                //return done(null);
                r.table('users')
                    .insert(user)
                    .run()
                    .then(function (result) {
                        user.id = result.generated_keys[0];
                        console.log(user.id);
                        return done(null, user);
                    })
                    .catch(function (err) {
                        return done(err);
                    })

            }
        }).catch(function (err) {
            return done(err);
        });

    // return done(null, user);

}

module.exports = function (app) {
    r=app.nylon.req.r;
    r.table('providers')
    .filter({provider:'GOOGLE'})
    .run()
    .then(function (data) {
        if (data.length > 0) {
            data[0].callback_url=app.nylon.config.host+"/api/oauth/google/callback";
            setConfigGoogle(data[0]);
        }else{
            console.log("google oauth not...");
        }
    }).catch(function (err) {
        return console.log(err);
    });
     
    
};