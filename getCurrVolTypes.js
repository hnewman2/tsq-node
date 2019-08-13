const db = require('./dbConnection');

function getCurrVolTypes(req, res) {

    let query = 'SELECT type_ID FROM Volunteer_VolType WHERE Vol_ID = ?;';

    db.query(query, req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.length > 0) {
            res.status(200);
            res.json(response);
        } else if(response){
            res.sendStatus(204)
        }else{
            res.sendStatus(500);
        }
    });
}

module.exports = getCurrVolTypes;