const db = require('./dbConnection');

function history(req, res, whereClause) {

    let query = 'with v (route_ID, date, volunteer, phone, sendSMS, isActive, partner_ID)\
    as(select PickupLog.route_ID, substr(PickupLog.activityTime,1,10) as date,\
         concat(Volunteers.lastName, \', \', Volunteers.firstName),  phone,\
         sendSMS,  isActive, partner_ID from PickupLog  inner join Volunteers on Volunteers.vol_ID = PickupLog.vol_ID ' + whereClause +
        ' ORDER BY date desc, route_ID ),\
    v2 (route_ID, date, volunteer, phone, sendSMS, isActive, partner )\
    as( select route_ID, date, volunteer, v.phone, v.sendSMS, v.isActive, \
    concat(Volunteers.lastName, \', \', Volunteers.firstName) from \
    v left join Volunteers on Volunteers.vol_ID= v.partner_ID )select * from v2  ORDER BY date desc, route_ID ;';

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
    let whereClause = '';
    history(req, res, whereClause);

}

function filterByRoute(req, res) {
    let queryByRoute = ' where PickupLog.route_ID =?';
    history(req, res, queryByRoute);
}

function filterByVol(req, res) {
    let queryByPhone = 'where Volunteers.phone=?';
    history(req, res, queryByPhone);
}

function filterByDate(req, res) {
    let queryByDate = 'where substr(PickupLog.activityTime,1,10) = ?';
    history(req, res, queryByDate);
}


module.exports = { unfiltered, filterByVol, filterByRoute, filterByDate }