const db = require('./dbConnection');

function history(req, res, query) {

    db.query(query, req.body, (error, response) => {
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

function unfiltered(req, res) {
    let query = 'select PickupLog.route_ID,  concat(Date(PickupLog.activityTime)) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, sendSMS from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID ORDER BY date desc;';
    history(req, res, query);

}

function filterByRoute(req, res) {
    let queryByRoute = 'select PickupLog.route_ID,  concat(Date(PickupLog.activityTime)) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, sendSMS from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID where PickupLog.route_ID =? ORDER BY date desc;';
    history(req, res, queryByRoute);
}

function filterByVol(req, res) {
    let queryByPhone = 'select PickupLog.route_ID,  concat(Date(PickupLog.activityTime)) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, sendSMS from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID where Volunteers.phone=? ORDER BY date desc;';
    history(req, res, queryByPhone);
}

function filterByDate(req, res) {
    let queryByDate = 'select PickupLog.route_ID,  concat(Date(PickupLog.activityTime)) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, sendSMS from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID where concat(Date(PickupLog.activityTime)) = ? ORDER BY date desc;';
    history(req, res, queryByDate);
}


module.exports = { unfiltered, filterByVol, filterByRoute, filterByDate }