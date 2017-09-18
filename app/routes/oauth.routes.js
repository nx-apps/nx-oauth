var passport = require('passport');
var URL = require('url');


module.exports = function (app) {
    //console.log(app);
    var oauth = require('../controllers/oauth.controller');

    app.get(['/userinfo'],app.authenticate("*"),oauth.userInfo);


    app.get('/login/:clientId/:clientKey', oauth.login);
   // app.get('/pin/:clientId/:clientKey', oauth.pin);

    app.post('/register', oauth.register);

    //app.get('/oauth/userinfo', oauth.userInfo);
    app.get('/logined', oauth.logined);
    app.get('/js/:clientId/:clientKey', function(req,res,next){
            oauth.js(req,res);
    } );

    app.get('/logout', passport.authenticate('jwt', { session: false }), oauth.logout);

    //app.route('/oauth/signup').get(oauth.signupPage).post(oauth.signup);

    app.post('/login/', passport.authenticate('local', {
        failureRedirect: '/api/oauth/login',
        successRedirect: '/api/oauth/logined'
    }));

    // app.get('/facebook', passport.authenticate('facebook', {
    //     failureRedirect: '/api/oauth/login'
    // }));


    // app.get('/facebook/callback', passport.authenticate('facebook', {
    //     failureRedirect: '/api/oauth/login',
    //     successRedirect: '/api/oauth/logined'
    // }));




    app.get('/google', passport.authenticate('google', {
        scope: [
            'profile',
            'email',
        ],
        failureRedirect: '/api/oauth/login'
    }));

    app.get('/google/callback', passport.authenticate('google', {
        failureRedirect: '/api/oauth/login',
        successRedirect: '/api/oauth/logined'
    }));


    return app;
}