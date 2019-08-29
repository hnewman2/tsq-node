const db = require('./dbConnection');

function updateEmailConfig(req, res) {

    let query = 'UPDATE EmailConfig SET user = ?, fromName = ?';
    db.query(query, [req.body.user, req.body.from], (error, response) => {
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