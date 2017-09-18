var passport = require('passport');
var sha1 = require('js-sha1');
var LocalStrategy = require('passport-local').Strategy;
const AD = require('activedirectory2');

// const config_ad= {
//     url: 'ldap://bkk01.ad.kmutnb.ac.th',
//     baseDN: 'OU=Internal_users,DC=ad,DC=kmutnb,DC=ac,DC=th',
//     username: 'sso@ad.kmutnb.ac.th',
//     password: 'ssoDemoTest8421!',
//     attributes: {
//         user: ['pid', 'cn', 'givenName', 'sn', 'displayName', 'bdate', 'emailAddress', 'userPrincipalName', 'sAMAccountName']
//     }
// }

var ad = null;
var r = null;

var setConfigAD = function (config) {


    if (config != null) {
        // const config_ad = {
        //     url: config.server,
        //     baseDN: config.scope,
        //     username: config.client_id,
        //     password: config.client_secret,
        //     attributes: {
        //         user: ['pid', 'cn', 'givenName', 'sn', 'displayName', 'bdate', 'emailAddress', 'userPrincipalName', 'sAMAccountName']
        //     }
        // }
        const config_ad = {
            url: 'ldap://bkk01.ad.kmutnb.ac.th:389',
            baseDN: 'OU=Internal_users,DC=ad,DC=kmutnb,DC=ac,DC=th',
            username: 'sso@ad.kmutnb.ac.th',
            password: 'ssoDemoTest8421!',
            attributes: {
                user: ['pid', 'cn', 'givenName', 'sn', 'displayName', 'bdate', 'emailAddress', 'userPrincipalName', 'sAMAccountName']
            }
        }
        console.log(config_ad)
        ad = new AD(config_ad);
    }

    passport.use(new LocalStrategy(
        setCallbackLogin
    ));

}

var setCallbackLogin = function (username, password, done) {
    console.log('LocalStrategy');
    r.table('users').filter(function (ff) {
        return ff('pid').eq(username)
            .and(ff('password').eq(sha1(password)))
            .and(ff('local').eq(true))
            .and(ff('register').eq(true))
            .and(ff('status').eq(true))
    })
        .run()
        .then(function (users) {
            if (users.length > 0) {
                done(null, users[0]);
            } else {
                if (ad != null) {
                    checkLoginWithAd(username, password, done);
                } else {
                    done(null);
                }
            }

        }).catch(function (err) {
            done(err);
        })

}


var checkLoginWithAd = function (username, password, done) {
    var usernamex = username + '@ad.kmutnb.ac.th';
    ad.authenticate(usernamex, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            done(err, null);
            // return;
        }

        if (auth) {
            console.log('Authenticated!');
            console.log(username);
            ad.findUsers('CN=' + username, true, function (err, users) {
                if (err) {
                    console.log(err);
                    //return;
                    done(err, null);
                }

                else if ((!users) || (users.length == 0)) {
                    console.log('No users found.');
                    done(err, null);
                }
                else {
                    //console.log('findUsers: ' + JSON.stringify(users));
                    // [{"pid":"1809900132441","cn":"nattaponc"
                    // ,"givenName":"NATTAPON","sn":"CHUMDEE","displayName":"ณัฐพล ชุมดี"
                    // ,"bdate":"1986-11-01","emailAddress":"nattapon.c@tgde.kmutnb.ac.th"
                    // ,"userPrincipalName":"nattaponc@office.kmutnb.ac.th","sAMAccountName":"nattaponc"}]

                    var user = {
                        pid: users[0].pid,
                        name: users[0].displayName,
                        email: users[0].emailAddress,
                        photo: '',
                        gender: '',
                        status: true,
                        register: true,
                        role: "User",
                        providers: [{
                            id: users[0].pid,
                            name: users[0].displayName,
                            fname: users[0].givenName,
                            sname: users[0].sn,
                            email: users[0].emailAddress,
                            bdate: users[0].bdate,
                            gender: '',
                            provider: 'LDAP'
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
                                    u.register = true;
                                    done(null, u);
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
                            done(err, null);
                        });


                }
            });

        }
        else {
            console.log('Authentication failed!');
        }
    });
}

module.exports = function (app) {
    r = app.nylon.req.r;
    //     r.table('providers')
    //     .filter({ provider: 'LDAP' }).changes().run(function(data){
    //         process.exit(1);
    //     })
    //    // .then(function(err,data){
    //     //    process.exit(1);
    //    // })
    //     //.each{

    //    // }

    r.table('providers')
        .filter({ provider: 'LDAP' })
        .run()
        .then(function (data) {
            if (data.length > 0) {
                setConfigAD(data[0]);
            } else {
                setConfigAD(null);
            }
        }).catch(function (err) {
            return console.log(err);
        });

}; 