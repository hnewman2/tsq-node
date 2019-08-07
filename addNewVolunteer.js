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

            if (req.body.selectedVolTypes.length > 0) {
                let query2 = 'SELECT vol_ID from Volunteers where phone = ?;';
                db.query(query2, req.body.phoneNumber, (error, response) => {
                    if (error) { console.log(error); }
                    if (response && response.length > 0) {
                        let vol_ID = response[0].vol_ID;
                        let allRows = [];
                        req.body.selectedVolTypes.forEach(v => {
                            let row = [];
                            row.push(vol_ID, v);
                            allRows.push(row);
                        });
                        let query3 = 'insert into Volunteer_VolType (vol_ID, type_ID) VALUES ?'
                        db.query(query3, [allRows], (error, response) => {
                            if (error) { console.log(error); }

                            if (response && response.affectedRows > 0) {
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(500);
                            }
                        });


                    } else {
                        res.sendStatus(500);
                    }
                });




            } else {
                res.sendStatus(200);
            }
        } else {
            res.sendStatus(500);
        }
    });

}
module.exports = addNewVolunteer