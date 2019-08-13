const db = require('./dbConnection');

function allRecipients(req, res) {
    let query = 'Select concat(lName, \', \',fName) as recipient, detail_ID from tsq.CurrentRoutesDetailView;';

    getRecipientFromDB(req, res, query);
}

function thisRecipient(req, res) {

    let query = 'select route_ID, concat(fName,\' \',lName) as recipient, familySize, concat( addressLine1,\' \',addressLine2) as address, phone, addressNotes, centerNotes, notes from tsq.CurrentRoutesDetailView where detail_ID=?;';
    getRecipientFromDB(req, res, query);
}

function getRecipientFromDB(req, res, query) {

    db.query(query, req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.length > 0) {
            console.log(response);
            res.status(200);
            res.json(response);
        } else {
            res.sendStatus(500);
        }
    });
}
module.exports = { allRecipients, thisRecipient }