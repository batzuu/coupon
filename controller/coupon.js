const Coupon = require('../models/schema/coupon');

module.exports.createCoupon = (req, res, next) => {

    var newCoupon = new Coupon(req.body);

    newCoupon.save((err, callback) => {
        if (err) return next(err);
        return res.send('Coupon was created');
    });
}

module.exports.getAllCoupons = (req, res, next) => {
    Coupon.find({}, (err, coupons) => {
        if (err) return next(err);

        return res.json(coupons);
    });
}

module.exports.getActiveCoupons = (req, res, next) => {
    var now = new Date();
    Coupon.find({
        $and: [
            {startDate: {$lt: now}},
            {approvedDate: {$exists: true}},
            {$or: [
                {endDate: {$gt: now}},
                {endDate: {$exists: false}}
            ]}
        ],
    }, (err, coupons) => {
        if (err) return next(err);

        return res.json(coupons);
    })
}

module.exports.getUnapprovedCoupons = (req, res, next) => {
    Coupon.find({
        approvedDate: {$exists: false}
    }, (err, coupons) => {
        if (err) return next(err);

        return res.json(coupons);
    });
}

module.exports.approveCouponById = (req, res, next) => {
    Coupon.findOneAndUpdate(req.params.id, {approvedDate: new Date()}, {new: true} , (err, coupon) => {
        if (err) return next(err);

        return res.json(coupon);
    })
}

module.exports.getCouponById = (req, res, next) => {
    Coupon.findById(req.params.id, (err, coupon) => {
        if (err) return next(err);
        if (!coupon) {
            return res.status(404).send('Coupon not found');
        }
        return res.json(coupon);
    });
}

module.exports.updateCouponById = (req, res, next) => {
    Coupon.findOneAndUpdate(req.params.id, req.body, {new: true}, (err, coupon) => {
        if (err) return next(err);

        if (!coupon) {
            return res.status(404).send('Coupon not found');
        }

        return res.json(coupon);

    });
}

module.exports.deleteCouponById = (req, res, next) => {
    Coupon.findOneAndDelete(req.params.id, (err, coupon) => {
        if (err) return next(err);

        if (!coupon)
            return res.send(404).send('Coupon not found');

        return res.send('Coupon was deleted');
    })
}