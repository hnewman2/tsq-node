const db = require('./dbConnection');

function addNewVolunteer(req, res) {
    let query = 'insert into Volunteers(firstName, lastName, address, city, state, zip, phone, sendSMS, email, sendEmail, primaryRouteID, shul_ID)\
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?);';

    db.query(query, [
        req.body.firstName, req.body.lastName, req.body.address,
        req.body.city, req.body.state, req.body.zip, req.body.phoneNumber,
        req.body.sendSMS, req.body.email, req.body.sendEmail,
        req.body.primaryRouteID, req.body.shul_ID
    ], (error, response) => {
        if (error) { console.log(error); }

        if (response && response.affectedRows > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }

    });

}
module.exports = addNewVolunteer