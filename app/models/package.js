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
    leadTime: {
        type: Date
    },
    relatedCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    charges: {
        type: Number
    },
    cost: {
        type: Number
    },
    referDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors'
    },
    package: [{
        item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services'
        },
        amount:String
    }],
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
