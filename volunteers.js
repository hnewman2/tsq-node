const db = require('./dbConnection');

function getVolunteers(req, res, query) {

    db.query(query, req.body, (error, response) => {
        if (error) { 
            console.log(error); 
        }
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

//returns all active volunteers with a list of their volTypes NOT INCLUDING RECIPIENTS/PICKUP.
function unfiltered(req, res) {
    let query = 'SELECT v1.vol_ID, v1.firstName, v1.lastName, v1.phone, v1.sendSMS, v1.email, v1.sendEmail, v1.primaryRouteID, v1.shul_ID,\
    GROUP_CONCAT(v3.typeDescription ORDER BY v3.typeDescription separator \', \') as \'VolunteerType\'\
     FROM Volunteers as v1\
     LEFT OUTER JOIN Volunteer_VolType as v2 ON v1.vol_ID = v2.vol_ID\
     LEFT OUTER JOIN VolunteerType as v3 ON v2.type_ID = v3.type_ID\
     where isActive AND v2.type_ID != 5\
     GROUP BY v1.vol_ID\
     ORDER BY v1.lastName, v1.firstName;';

    getVolunteers(req, res, query);
}

//returns all active volunteers that are a part of the specified volType.
function filterByVolType(req, res) {
    let query = 'SELECT v1.vol_ID, v1.firstName, v1.lastName, v1.phone, v1.sendSMS, v1.email, v1.sendEmail, v1.primaryRouteID, v1.shul_ID,\
     v3.typeDescription as \'VolunteerType\'\
     FROM Volunteers as v1\
     INNER JOIN Volunteer_VolType as v2 ON v1.vol_ID = v2.vol_ID\
     INNER JOIN VolunteerType as v3 ON v2.type_ID = v3.type_ID\
     where isActive AND v2.type_ID = ?\
     GROUP BY v1.vol_ID\
     ORDER BY v1.lastName, v1.firstName;';

    getVolunteers(req, res, query);
}

//returns all active volunteers with a list of their volTypes NOT INCLUDING RECIPIENTS/PICKUP for the specified route number.
function filterByRoute(req, res) {
    let query = 'SELECT v1.vol_ID, v1.firstName, v1.lastName, v1.phone, v1.sendSMS, v1.email, v1.sendEmail, v1.primaryRouteID, v1.shul_ID,\
    GROUP_CONCAT(v3.typeDescription order by v3.typeDescription separator \', \') as \'VolunteerType\'\
     FROM Volunteers as v1\
     LEFT OUTER JOIN Volunteer_VolType as v2 ON v1.vol_ID = v2.vol_ID\
     LEFT OUTER JOIN VolunteerType as v3 ON v2.type_ID = v3.type_ID\
     where isActive AND v1.primaryRouteID = ? AND v2.type_ID != 5\
     GROUP BY v1.vol_ID\
     ORDER BY v1.lastName, v1.firstName;';

    getVolunteers(req, res, query);
}


function allVolAndRecipients(req, res){
    let query = 'SELECT v1.vol_ID, v1.firstName, v1.lastName, v1.phone, v1.sendSMS, v1.email, v1.sendEmail, v1.primaryRouteID, v1.shul_ID,\
    GROUP_CONCAT(v3.typeDescription ORDER BY v3.typeDescription separator \', \') as \'VolunteerType\'\
     FROM Volunteers as v1\
     LEFT OUTER JOIN Volunteer_VolType as v2 ON v1.vol_ID = v2.vol_ID\
     LEFT OUTER JOIN VolunteerType as v3 ON v2.type_ID = v3.type_ID\
     where isActive\
     GROUP BY v1.vol_ID\
     ORDER BY v1.lastName, v1.firstName;';

    getVolunteers(req, res, query);
}

function developers(req, res) {
    let query = 'SELECT v1.vol_ID, v1.firstName, v1.lastName, v1.phone, v1.sendSMS, v1.email, v1.sendEmail, v1.primaryRouteID, v1.shul_ID,\
    GROUP_CONCAT(v3.typeDescription ORDER BY v3.typeDescription separator \', \') as \'VolunteerType\'\
     FROM Volunteers as v1\
     LEFT OUTER JOIN Volunteer_VolType as v2 ON v1.vol_ID = v2.vol_ID\
     LEFT OUTER JOIN VolunteerType as v3 ON v2.type_ID = v3.type_ID\
     where v1.vol_ID in(692, 703, 704)\
     GROUP BY v1.vol_ID\
     ORDER BY v1.lastName, v1.firstName;';

    getVolunteers(req, res, query);
}

module.exports = { unfiltered, filterByVolType, filterByRoute, allVolAndRecipients, developers }