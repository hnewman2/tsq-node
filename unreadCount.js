const db = require('./dbConnection');

function unreadCount(req, res){

    let query = 'Select sum(readStatus) as count from SmsInbox' ;
    db.query(query, (error, response) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        }
        else {
           // console.log(query);
            res.status(200);
            res.json(response);
        }
    });

}
module.exports= unreadCount