module.exports = function (app) {
    var controller = require('../controllers/apps.controller');
    app.get(['/', '/list'], controller.list);
    app.get('/app', controller.get);
    app.get('/app/:id', controller.getById);
    app.post('/app', controller.insert);
    app.put('/app', controller.update);
    app.delete('/app/:id', controller.delete);
}