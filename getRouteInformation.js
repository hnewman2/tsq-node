const db = require('./dbConnection');

function getRouteInformation(req, res) {

    let query = 'SELECT * FROM CurrentRoutesDetailView WHERE route_ID = ?';

    db.query(query, req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.length > 0) {
            res.status(200);
            res.json(response);
        }
        else {
            res.sendStatus(500);
        }
    });
}

module.exports = getRouteInformation;