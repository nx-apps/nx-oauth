module.exports = function (app) {
    var controller = require('../controllers/roles.controller');
    // app.get('/test',(req,res)=>{
    //     res.json({a:'ssssssss'})
    // });
    app.get('/roles/:app_id', controller.getRoles);
    app.put('/roles', controller.putRoles);
}