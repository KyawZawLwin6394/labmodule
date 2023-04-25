"use strict";

const ReferCommission = require("../controllers/referCommissionController");
const { catchError } = require("../lib/errorHandler");

module.exports = (app) => {

    app.route('/api/refer-commission')
        .post(catchError(ReferCommission.createReferCommission))
        .put(catchError(ReferCommission.updateReferCommission))
        
    app.route('/api/refer-commission/:id')
        .get(catchError(ReferCommission.getReferCommission))
        .delete(catchError(ReferCommission.deleteReferCommission))
        .post(catchError(ReferCommission.activateReferCommission))

    app.route('/api/refer-commissions').get(catchError(ReferCommission.listAllReferCommissions))
};
