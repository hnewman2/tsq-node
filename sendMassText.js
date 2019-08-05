const dotenv = require('dotenv')
dotenv.config();

const accountSid = process.env.TWILIO_AUTH_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const service = client.notify.services('IS1619d0b3d762003942b1d4108ec9266e');

function sendMassText(req, res) {

    let nums = req.body.recipients;

    const bindings = nums.split(',').map(num => {
        return JSON.stringify({ binding_type: 'sms', address: '+1' + num });
    });

    notification = service.notifications.create({
            toBinding: bindings,
            body: req.body.body,
            // statusCallback: 'http://f42ba244.ngrok.io/messageStatus'
        }).then(() => {
            console.log(notification);

            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })

}
module.exports = sendMassText