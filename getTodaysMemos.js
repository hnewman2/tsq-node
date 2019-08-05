
const db = require('./dbConnection');

function getTodaysMemos(req, res) {

    query='select * from PrintoutMemos where display;'

    db.query(query,req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response ) {
            res.status(200);
            res.json(response);
        }
      
        else {
            res.sendStatus(500);
        }
    });
}

module.exports = getTodaysMemos