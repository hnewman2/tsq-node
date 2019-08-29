nodemailer = require('nodemailer');
const db = require('./dbConnection');

function emailSettings(req, res, filePath, fileName) {
    var user, from;

    let query = 'select * from EmailConfig';
    db.query(query, (error, response) => {
        if (error) {
            console.log(error);
        }
        if (response && response.length > 0) {
            user = response[0].user;
            from = response[0].fromName;

            if (filePath && fileName) {
                sendEmailWithAttachment(req, res, filePath, fileName, user, from)
            } else {
                getEmailData(req, res, user, from)
            }
        }
    });
}


function getEmailData(req, res, user, from) {

    var recipients = req.body.recipients;
    var subject = req.body.subject;
    var body = req.body.body;
    var password = req.body.password;


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: password
        }
    });

    var mailOptions = {
        from: from,
        bcc: recipients,
        subject: subject,
        text: body,
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            if (error) { console.log(error); }
            res.sendStatus(401);
        } else {
            res.sendStatus(200);
        }
    });

}

function sendEmailWithAttachment(req, res, filePath, fileName, user, from) {

    var recipients = req.body.recipients;
    var subject = req.body.subject;
    var body = req.body.body;
    var password = req.body.password;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: password
        }
    });

    var mailOptions = {
        from: from,
        bcc: recipients,
        subject: subject,
        text: body,
        attachments: [{ // file on disk as an attachment
            filename: fileName,
            path: filePath
        }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            if (error) { console.log(error); }
            res.sendStatus(401);
        } else {
            console.log(info)
            res.sendStatus(200);
        }
    });

}

module.exports = emailSettings;