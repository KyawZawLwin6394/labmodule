"use strict";

const accountHeader = require("../controllers/accountSubHeaderController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/account-subheader')
        .post(catchError(accountHeader.createAccountSubHeader))
        .put(catchError(accountHeader.updateAccountSubHeader))
        
    app.route('/api/account-subheader/:id')
        .get( catchError(accountHeader.getAccountSubHeader))
        .delete(catchError(accountHeader.deleteAccountSubHeader)) 
        .post(catchError(accountHeader.activateAccountSubHeader))

    app.route('/api/account-subheaders').get(catchError(accountHeader.listAllAccountSubHeaders))
    app.route('/api/account-subheaders/related/:id').get (catchError(accountHeader.getRelatedAccountSubHeader))
};
