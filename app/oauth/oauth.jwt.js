var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('./extract_jwt');
var fs = require('fs');
const config = require(process.cwd() + '/config/config');
module.exports = function (db) {
  var cert = fs.readFileSync(process.cwd() + '/ssl/server.key');  // get private key
  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.versionOneCompatibility({}),
      secretOrKey: cert
    },
    function (jwt_payload, done) {
      done(null, jwt_payload);
    }));

};