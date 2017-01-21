var jwt      = require('jsonwebtoken');

var express  = require('express');

var routes = function (passport, Outlet, Address) {
    
    var router = express.Router();
    var outletController = require('../controllers/outletController')(Outlet, Address);
    
    router.use(passport.authenticate('jwt', { session: false }));

    router.route('/')
            .get(outletController.get)
            .post(outletController.create);
    router.route('/:id')
            .delete(outletController.delete);

    return router;
}
module.exports = routes;