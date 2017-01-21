var jwt      = require('jsonwebtoken');
var express  = require('express');

var routes = function (passport, Order, OrderImage, User, Outlet, Address) {
    
    var router = express.Router();
    var orderController = require('../controllers/orderController')(Order, OrderImage, User, Outlet, Address);
    
    router.use(passport.authenticate('jwt', { session: false }));

    router.get('/paper', orderController.getPaperTypes);
    router.get('/size', orderController.getSizes);
    router.get('/orderType', orderController.getOrderTypes);
    router.get('/status', orderController.getStatus);

    
    // router.route('/:id')
    //         .get(orderController.get)    
    //         .delete(orderController.delete);

    return router;
}
module.exports = routes;