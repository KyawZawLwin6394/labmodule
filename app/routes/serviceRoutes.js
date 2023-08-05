"use strict";

const service = require("../controllers/servicesController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/service')
        .post(catchError(service.createService))
        .put(catchError(service.updateService))

    app.route('/api/service/:id')
        .get(catchError(service.getService))
        .delete(catchError(service.deleteService))
        .post(catchError(service.activateService))

    app.route('/api/services').get(catchError(service.listAllServices))
    app.route('/api/services/usage').post(catchError(service.servicesUsage))

};
