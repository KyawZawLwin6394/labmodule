"use strict";

const Package = require("../controllers/packageController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/package')
        .post(catchError(Package.createPackage))
        .put(catchError(Package.updatePackage))
        
    app.route('/api/package/:id')
        .get(catchError(Package.getPackage))
        .delete(catchError(Package.deletePackage))
        .post(catchError(Package.activatePackage))

    app.route('/api/packages').get(catchError(Package.listAllPackages))
};
