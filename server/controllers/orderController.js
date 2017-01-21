var orderController = function (Order, OrderImage, User, Outlet, Address) {
    
    var getPaperTypes = function (req, res) {
        res.status(200).json(OrderImage.schema.path('paper').enumValues);
    };

    var getSizes = function (req, res) {
        res.status(200).json(OrderImage.schema.path('size').enumValues);
    };

    var getOrderTypes = function (req, res) {
        res.status(200).json(Order.schema.path('type').enumValues);
    };

    var getStatus = function (req, res) {
        res.status(200).json(Order.schema.path('status').enumValues);
    };

    return {
        getPaperTypes: getPaperTypes,
        getSizes: getSizes,
        getOrderTypes: getOrderTypes,
        getStatus: getStatus
    };
};

module.exports = orderController;