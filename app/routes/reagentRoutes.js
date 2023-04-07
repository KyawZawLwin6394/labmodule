"use strict";

const reagent = require("../controllers/reagentController");
const { catchError } = require("../lib/errorHandler");
const  verifyToken= require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/reagent')
        .post(catchError(reagent.createReagent))
        .put( catchError(reagent.updateReagent))
        
    app.route('/api/reagent/:id')
        .get(catchError(reagent.getReagent))
        .delete( catchError(reagent.deleteReagent)) 
        .post( catchError(reagent.activateReagent))

    app.route('/api/reagents').get(catchError(reagent.listAllReagents))

};
