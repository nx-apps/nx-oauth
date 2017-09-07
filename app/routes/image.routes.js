
module.exports=function(app){
    var imageCtrl = require('../controllers/image/image.controller');
    app.post('/image',imageCtrl.uploadImage); 
    app.get('/image/:id',imageCtrl.downloadImage); 
} 