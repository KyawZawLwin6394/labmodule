"use strict";

const journal = require("../controllers/journalEntryController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/journal')
        .post(catchError(journal.createJournal))
        .put(catchError(journal.updateJournal))
        
    app.route('/api/journal/:id')
        .get(catchError(journal.getJournal))
        .delete(catchError(journal.deleteJournal))

    app.route('/api/journals').get(catchError(journal.getAllJournals))
};
