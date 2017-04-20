module.exports=function(app){
    var setting = require('../controllers/setting/setting.controller');
    app.get('/setting',setting.getSetting);
    app.put('/setting',setting.updateSetting);
} 