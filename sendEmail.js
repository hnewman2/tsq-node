nodemailer = require('nodemailer');

function getEmailData(req, res) {

  var recipients = req.body.recipients;
  var subject = req.body.subject;
  var body = req.body.body;
  var password = req.body.password;


  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'deliveries@tsqinc.org',
      pass: password
    }
  });

  var mailOptions = {
    from: 'TSQ <deliveries@tsqinc.org>',
    bcc: recipients,
    subject: subject,
    text: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      if (error) { console.log(error); }
      res.sendStatus(401);
    } else {
      res.sendStatus(200);
    }
  });

}

function sendEmailWithAttachment(req, res, filePath, fileName){

  var recipients = req.body.recipients;
  var subject = req.body.subject;
  var body = req.body.body;
  var password = req.body.password;
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'deliveries@tsqinc.org',
      pass: password
    }
  });

  var mailOptions = {
    from: 'TSQ <deliveries@tsqinc.org>',
    bcc: recipients,
    subject: subject,
    text: body,
    attachments:[
      {   // file on disk as an attachment
        filename: fileName,
        path: filePath
    }
    ]
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      if (error) { console.log(error); }
      res.sendStatus(401);
    } else {
      console.log(info)
      res.sendStatus(200);
    }
  });

}

module.exports = {getEmailData, sendEmailWithAttachment};


