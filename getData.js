const db = require('./dbConnection');

function getData(req, res, query) {

    db.query(query, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.length > 0) {
            res.status(200);
            res.json(response);
        }
        else if (response) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(500);
        }
    });
}

module.exports = getData
