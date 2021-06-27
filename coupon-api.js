const express = require('express');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const config = require('./models/config');
const users = require('./controller/users')
const coupons = require('./controller/coupon')

var app = express();

mongoose.connect('mongodb://localhost:5000', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

if (app.get('env') === 'development') var dev = true;

if (dev) app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//===============================
// Middleware to check param
//===============================

app.param('id', function(req, res, next, id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('Invalid Id');
    }
    next();
});

//===============================
// Routes
//===============================

app.get('/users', users.getUsers);
app.get('/users/:id', users.getUserById);
app.post("/users", users.createUser);
app.put('/users/:id', users.updateUserById);
app.delete('/user/:id', users.deleteUserById);


app.get('/coupons', coupons.getAllCoupons);
app.get('/coupons/:id', coupons.getCouponById);
app.post("/coupons", coupons.createCoupon);
app.put('/coupons/:id', coupons.updateCouponById);
app.delete('/user/:id', coupons.deleteCouponById);

// to handle 404
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error
if (dev) {
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(err.status || 500).send();
    });
}

// production error 
app.use((err, req, res, next) => {
    res.status(err.status || 500).send();
});

var server = app.listen(config.port);

console.log('Listening at http://localhost:%s in %s mode', server.address().port, app.get('env'));

module.exports = app;