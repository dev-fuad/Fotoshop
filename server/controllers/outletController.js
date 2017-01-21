var outletController = function (Outlet, Address) {

    var getList = function (req, res) {
        Outlet.find().select('-__v -createdAt').populate('address', '-__v -createdAt').exec(function (err, result) {
            if (err) {
                res.status(500).json({ success: false, error: err });
            }
            res.status(200).json(result);
        });
    };
    
    var create = function (req, res) {
        if (!req.body.name || !req.body.address.addressLine1 || !req.body.address.city ||
            !req.body.address.state || !req.body.address.country) {
            res.status(400).json({ success: false, message: 'Please fill all the details.' });
        } else {
            var address = new Address({
                name: 'Outlet',
                addressLine1: req.body.address.addressLine1,
                addressLine2: req.body.address.addressLine2,
                city: req.body.address.city,
                state: req.body.address.state,
                country: req.body.address.country
            });
            address.save(function (err) {
                var outlet = new Outlet({
                    name: req.body.name,
                    address: address
                });

                outlet.save(function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ success: false, error: err });
                    } else {
                        res.status(201).json({ success: true, message: 'New Outlet saved' })
                    }
                });
            });
        }
    };

    var deleteOutlet = function (req, res) {
        Outlet.findOne({ _id: req.params.id }, function (err, result) {
            if (err) {
                res.status(404).json({ success: false, message: 'Unable to find outlet.' });
            } else if (!result) {
                res.status(404).json({ success: false, message: 'Unable to find outlet.' });
            } else {
                Address.remove({ _id: result.address }, function (err) {
                    if (err) {
                        res.status(404).json({ success: false, message: 'Unable to find address.' });
                    } else {
                        Outlet.remove({ _id: req.params.id }, function (err) {
                            if (err) {
                                res.status(500).json({ success: false, error: err });
                            } else {
                                res.status(200).json({ success: true, message: 'The outlet was deleted.' });
                            }
                        });
                    }
                });
            }
        });
    };
    
    return {
        get: getList,
        create: create,
        delete: deleteOutlet
    };
}

module.exports = outletController;