
const db = require('./dbConnection');

function addMemo(req, res) {

    query='Insert into PrintoutMemos (body) values(?);'

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

module.exports = addMemo