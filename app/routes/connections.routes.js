module.exports = function (app) {
    var controller = require('../controllers/connections.controller');
    app.get('/:id', controller.getById);
}