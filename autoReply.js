const db = require('./dbConnection');

function autoReply(req, res, app) {

    var m = req.body


    var messageString = [];
    messageString.push(m.AccountSid, m.ApiVersion, m.Body, m.From, m.MessagingServiceSid, m.NumMedia, m.NumSegments, m.SmsMessageSid, m.SmsStatus, m.To, 1);

    query = ' SET character_set_client=utf8mb4; INSERT IGNORE INTO SmsInbox (`AccountSid`, `ApiVersion`, `Body`, `FromPhone`, `MessagingServiceSid`,\
    `NumMedia`,`NumSegments`,`SmsSid`,`SmsStatus`, `ToPhone`,ReadStatus) VALUES(?);';

    db.query(query, [messageString], (error, response) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {

            app.emit('message', {
                title: 'New message!',
                m,
                timestamp: new Date()
            });
            console.log(' ');
            console.log(response);
            res.status(200);
            res.end();

        }
    });

}



function initialiseSSE(req, res, app) {

    let handleMessage = data => {
        res.write(`event: message\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    req.on('close', function() {
        app.removeListener('message', handleMessage);
    });

    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });

    app.on('message', handleMessage);

}

module.exports = { autoReply, initialiseSSE }