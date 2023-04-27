'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');


let ReagentSchema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    stockUnit: [{
        unitName: String,
        stock: Number,
        purchasePrice: Number
    }],
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suppliers'
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

module.exports = mongoose.model('Reagents', ReagentSchema);

//Author: Kyaw Zaw Lwin
