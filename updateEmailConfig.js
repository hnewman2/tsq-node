const db = require('./dbConnection');
const dotenv = require('dotenv')
dotenv.config();

function updateEmailConfig(req, res) {
    var key_str = process.env.KEY_STR;

    let query = 'UPDATE EmailConfig SET user = ?, fromName = ?, pswd = AES_ENCRYPT(?, \''+key_str +'\');';
    db.query(query, [req.body.user, req.body.from, req.body.pswd], (error, response) => {
        if (error) {
            console.log(error);
        }
        if (response && response.affectedRows > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });
}

module.exports = updateEmailConfig;