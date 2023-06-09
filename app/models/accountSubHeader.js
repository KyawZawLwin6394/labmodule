'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let AccountSubHeaderSchema = new Schema({
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    updatedAt: {
        type: Date,
    },
    relatedAccountType: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'AccountTypes'
    },
    relatedAccountHeader: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'AccountHeaders'
    }
});

module.exports = mongoose.model('AccountSubHeaders', AccountSubHeaderSchema);

//Author: Kyaw Zaw Lwin
