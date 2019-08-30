const db = require('./dbConnection');

function getAllRouteInfo(req, res) {

    let query = 'SELECT * FROM CurrentRoutesDetailView inner join currentRoutesView on CurrentRoutesDetailView.route_ID = currentRoutesView.route_ID Order by CurrentRoutesDetailView.route_ID, familySize desc;';
    db.query(query, req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.length > 0) {
            res.status(200);
            res.json(response);
        } else {
            res.sendStatus(500);
        }
    });
}

module.exports = getAllRouteInfo;