const db = require('./dbConnection');

function editVol(req, res) {

    var query = 'UPDATE Volunteers SET\
        firstName = ?, lastName = ?, address = ?, city = ?, state =?, zip = ?,\
        phone = ?, sendSMS = ?, email = ?, sendEmail = ?, shul_ID = ?, primaryRouteID = ? where vol_ID=?;'

    db.query(query, [req.body.firstName, req.body.lastName, req.body.address,
    req.body.city, req.body.state, req.body.zip, req.body.phone, req.body.sendSMS,
    req.body.email, req.body.sendEmail, req.body.shul_ID, req.body.primaryRouteID, req.body.vol_ID], (error, response) => {
        if (error) { 
            console.log(error); 
        }
        if (response && response.affectedRows > 0) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(503);
        }
    })
}

module.exports = editVol;