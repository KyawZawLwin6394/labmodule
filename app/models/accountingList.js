'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let AccountingListSchema = new Schema({
    code: {
        type: String
    },
    relatedType: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'AccountTypes'
    },
    relatedHeader: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'AccountHeaders'
    },
    relatedSubHeader: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'AccountSubHeaders'
    },
    subHeader: {
        type:String
    },  
    name: {
        type: String
    },
    amount: {
        type: Number,
        required: true,
    },
    openingBalance: {
        type: Number
    },
    generalFlag: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    relatedCurrency: {
        type:String
      },
    carryForWork: {
        type:Boolean
    },
    relatedBank: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Banks'
    },
    accountNature: {
        type: String,
        default: "Debit"
    }
});

module.exports = mongoose.model('AccountingLists', AccountingListSchema);

//Author: Kyaw Zaw Lwin
