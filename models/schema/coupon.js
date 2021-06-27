const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true, trim: true},
    url: {type: String, required: true, trim: true},
    companyName: {type: String, required: true, trim: true},
    startDate: {type: Date, default: Date.now, index: true},
    endDate: {type: Date, index: true},
    tags: [Number],
    clicks: {type: [Date], default: []},
    views: {type: [Date], default: []},
    redeems: {type: [Date], default: []}, 
    postedBy: Schema.ObjectId, // {type: Schema.ObjectId, ref: 'User', required: true},
    approvedDate: Date,
},
{
    toObject: {getters: true},
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate'
    }
});

userSchema.pre('save', (callback) => {
    if (!this.startDate) {
        this.startDate = new Date();
    }
    callback();
});

// creating methods
userSchema.methods.greet = () => {
    console.log('hi!');
};

var Coupon = mongoose.model('Coupon', userSchema);

module.exports = Coupon;
