const User = require('../models/schema/user');


//===============================
// User data handling
//===============================

module.exports.createUser = (req, res) => {
    // validate input here
    
    console.log(typeof(req.body.phone))
    if (typeof(req.body.phone) !== 'string') {
        return res.status(400).send('No Phone');
    }
    if (typeof(req.body.phoneProvider) !== 'string') {
        return res.status(400).send('No Phone Provider');
    }

    console.log(req.body);
    var data = req.body;
    

    var newUser = new User(data);

    newUser.save((err, user) => {
        if (err) console.log(err);
        return res.send('User created');
    })
};

module.exports.getUsers = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) return next(err)
        console.log(typeof(users));
        
        return res.json(users);
    });
}

module.exports.getUserById = (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) 
            return res.status(404).send('user not found');
        
        return res.json(user);
    });
};

module.exports.updateUserById= function(req, res, next) {
    User.findOneAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err) return next(err);
        if (!user)
            return res.status(404).send('user not found');
        
        return res.json(user);
    })
}

module.exports.deleteUserById = (req, res, next) => {
    User.findOneAndDelete(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user)
            return res.send(404).send('user not found');

        return res.send('User was deleted');
    })
}
