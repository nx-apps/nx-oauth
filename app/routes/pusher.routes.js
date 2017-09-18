
var fs = require('fs');
const config = require(process.cwd() + '/config/config');

const work_dir = process.cwd();
module.exports = function (app) {

     app.get('/', function (req, res, next) {
            try {
                res.pusher(false, function (err) {
                    res.end("");
                });
                       //});
            } catch (e) {

                console.log(e);
            }


        });
  
}