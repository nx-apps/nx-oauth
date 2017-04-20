module.exports = function(app){
    var common = require('../controllers/common/common.controller');
    app.get('/appList',common.appList);
}