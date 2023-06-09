 "use strict";

const transaction = require("../controllers/transactionController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/transaction')
        .post(catchError(transaction.createTransaction))
        .put(catchError(transaction.updateTransaction))

    app.route('/api/transactions/related/:id')
        .get (catchError(transaction.getRelatedTransaction))

        app.route('/api/transactions/relatedExpense/:id')
        .get (catchError(transaction.getRelatedTransactionExpense))


        app.route('/api/transactions/relatedIncome/:id')
        .get (catchError(transaction.getRelatedTransactionIncome))
    
    app.route('/api/transactions/relatedtransactions')
        .post (catchError(transaction.getRelatedTransactions))
        
    app.route('/api/transaction/:id')
        .get( catchError(transaction.getTransaction))
        .delete(catchError(transaction.deleteTransaction)) 
        .post(catchError(transaction.activateTransaction))

    app.route('/api/transactions').get(catchError(transaction.listAllTransactions))
    app.route('/api/transactions/trial-balance').get(catchError(transaction.trialBalance))
    app.route('/api/transactions/trial-balance/type').get(catchError(transaction.trialBalanceWithType))
};
