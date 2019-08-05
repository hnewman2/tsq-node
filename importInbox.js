const accountSid = process.env.TWILIO_AUTH_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const db = require('./dbConnection')

function importInbox(req, res, limit) {
    var allMessages = [];
    var total = 0;


    client.messages.list({ limit: limit })
        .then(messages => {

            messages.forEach(m => {

                var messageString = [];
                messageString.push(m.accountSid, m.apiVersion, m.body, m.dateCreated, m.dateUpdated, m.dateSent,
                    m.direction, m.errorCode, m.errorMessage, m.from, m.messagingServiceSid, m.numMedia, m.numSegments,
                    m.price, m.priceUnit, m.sid, m.status, m.to);
                total += 1;
                //  console.log(messageString);
                allMessages.push(messageString)
            });

            query = ' SET character_set_client=utf8mb4; INSERT IGNORE INTO SmsInbox (`AccountSid`, `ApiVersion`, `Body`, `DateCreated`,`DateUpdated`, `DateSent`,\
          `direction`, `errorCode`,`errorMessage`, `FromPhone`, `MessagingServiceSid`,`NumMedia`,`NumSegments`,\
          `price`, `priceUnit`, `SmsSid`,`SmsStatus`, `ToPhone`) VALUES ?';

            db.query(query, [allMessages], (error, response) => {
                if (error) {
                    console.log(error.sqlMessage);
                    res.sendStatus(500);
                } else {
                    console.log(response);
                    console.log(total);
                    res.sendStatus(200);
                }

            });
        });
}

function updateAll(req, res) {
    var limit = 3000;
    importInbox(req, res, limit)
}

function addSent(req, res) {
    var limit = 3;
    importInbox(req, res, limit)
}
module.exports = { updateAll, addSent }