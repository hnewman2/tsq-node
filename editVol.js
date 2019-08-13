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

            if (req.body.modified) {
                //modified the vol types, need to remove all old ones and put in the new ones
                //remove old ones
                let query2 = 'DELETE from Volunteer_VolType WHERE vol_ID = ?;';
                db.query(query2, req.body.vol_ID, (error, response) => {
                    if (error) { console.log(error); }

                    if (response && req.body.modifiedVolTypes.length>0) {
                        //put in new ones with bulk insert
                        let allRows = [];
                        req.body.modifiedVolTypes.forEach(v => {
                            let row = [];
                            row.push(req.body.vol_ID, v);
                            allRows.push(row);
                        });
                        let query3 = 'insert into Volunteer_VolType (vol_ID, type_ID) VALUES ?;';
                        db.query(query3, [allRows], (error, response) => {
                            if (error) { console.log(error); }

                            if (response && response.affectedRows > 0) {
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(500);
                            }
                        });
                    } else if(response){
                        res.sendStatus(200);
                    }else{
                        res.sendStatus(500);
                    }
                });

            }
            else {
                res.sendStatus(200);
            }
        }
        else {
            res.sendStatus(500);
        }
    })
}

module.exports = editVol;