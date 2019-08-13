const db = require('./dbConnection');

function history(req, res, query) {

    db.query(query, req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.length > 0) {
            res.status(200);
            res.json(response);
        } else if (response) {
            res.sendStatus(204);
        } else {
            res.sendStatus(500);
        }
    });

}

function unfiltered(req, res) {
    let query = 'select PickupLog.route_ID,  substr(PickupLog.activityTime,1,10) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, concat(Volunteers.firstName, \' \',  Volunteers.lastName), sendSMS, isActive from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID ORDER BY date desc, route_ID;';
    history(req, res, query);

}

function filterByRoute(req, res) {
    let queryByRoute = 'select PickupLog.route_ID,  substr(PickupLog.activityTime,1,10) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, sendSMS, isActive from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID where PickupLog.route_ID =? ORDER BY date desc;';
    history(req, res, queryByRoute);
}

function filterByVol(req, res) {
    let queryByPhone = 'select PickupLog.route_ID,  substr(PickupLog.activityTime,1,10) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, sendSMS,isActive from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID where Volunteers.phone=? ORDER BY date desc, route_ID;';
    history(req, res, queryByPhone);
}

function filterByDate(req, res) {
    let queryByDate = 'select PickupLog.route_ID,  substr(PickupLog.activityTime,1,10) as date, concat(Volunteers.firstName, \' \',  Volunteers.lastName) as volunteer, phone, sendSMS, isActive from PickupLog\
    inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID where substr(PickupLog.activityTime,1,10) = ? ORDER BY date desc, route_ID;';
    history(req, res, queryByDate);
}


module.exports = { unfiltered, filterByVol, filterByRoute, filterByDate }