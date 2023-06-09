"use strict";

const comission = require("../controllers/comissionController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');
const commission = require("../models/commission");

module.exports = (app) => {

    app.route('/api/comission')
        .get(catchError(comission.searchCommission))
        .post(catchError(comission.collectComission))
};
