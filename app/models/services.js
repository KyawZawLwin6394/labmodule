'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let ServiceSchema = new Schema({
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
    reagentItems: [{
        item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reagents'
        },
        amount: Number
    }],
    nominalFlag: {
        type: String,
        enum: ['Above', 'Below']
    },
    nominalValue: {
        type: String
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
    },
    referenceRange: [{
        from:Number,
        to:Number,
        gender:String,
        unit:String
    }],
    specialComment:{
        type:String
    },
    comment:{
        type:String
    }
});

module.exports = mongoose.model('Services', ServiceSchema);

//Author: Kyaw Zaw Lwin
