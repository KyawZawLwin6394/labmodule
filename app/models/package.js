'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let PackageSchema = new Schema({
    code: {
        type: String
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    package: [{
        item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services'
        },
        amount:Number
    }],
    totalCharges:{
        type:Number
    },
    totalCost:{
        type:Number
    },
    status:{
        type:String,
        enum:['Active','Pending']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Packages', PackageSchema);

//Author: Kyaw Zaw Lwin
