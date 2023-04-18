"use strict";

const test = require("../controllers/testController");
const { catchError } = require("../lib/errorHandler");
const  verifyToken= require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/test')
        .post(catchError(test.createTest))
        .put( catchError(test.updateTest))
        
    app.route('/api/test/:id')
        .get(catchError(test.getTest))
        .delete( catchError(test.deleteTest)) 
        .post( catchError(test.activateTest))

    app.route('/api/tests').get(catchError(test.listAllTests))

};
