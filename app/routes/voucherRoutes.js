"use strict";

const voucher = require("../controllers/voucherController");
const { catchError } = require("../lib/errorHandler");
const  verifyToken= require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/voucher')
        .post(catchError(voucher.createVoucher))
        .put( catchError(voucher.updateVoucher))
        .get(catchError(voucher.getRelatedVouchers))
        
    app.route('/api/voucher/:id')
        .get(catchError(voucher.getVoucher))
        .delete( catchError(voucher.deleteVoucher)) 
        .post( catchError(voucher.activateVoucher))

    app.route('/api/vouchers').get(catchError(voucher.listAllVouchers))

};
