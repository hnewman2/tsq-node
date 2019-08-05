const db = require('./dbConnection');

function getVolunteerTypes(req, res) {

    let query = 'SELECT * FROM VolunteerType;';

    db.query(query, (error, response) => {
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

module.exports = getVolunteerTypes;