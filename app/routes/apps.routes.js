module.exports = function (app) {
    var controller = require('../controllers/apps.controller');
    app.get(['/', '/list'], controller.list);
    app.get('/app', controller.get);
    app.get('/app/:id', controller.getById);
    app.post('/app', controller.insert);
    app.put('/app', controller.update);
    app.delete('/app/:id', controller.delete);
    app.get('/connects/:id', controller.connects);
    
    app.get('/users/:id', controller.users);
    app.put('/users', controller.update_users);
    app.get('/balanceList', controller.getBalanceList);
    app.post('/request', controller.insertRequest);

    app.get('/appList', controller.getAppList);

    app.get('/client', controller.getClient);
    app.put('/client', controller.updateClient);

    //new client//
    app.post('/clients', controller.sentClient);
    app.get('/clients', controller.selectClient); 
    app.get('/clientsAlone', controller.selectClientAlone); 
    app.put('/clients', controller.editClient); 
    app.delete('/clients/:id', controller.deleteClient);

}